from django.db import transaction
import xlwt
from rest_framework.views import APIView
from django.db.models import Sum, F, Value, Q, FloatField
from rest_framework.response import Response
from django.utils.decorators import method_decorator
from django.db.models.functions import Coalesce
from django.http.response import HttpResponse
from rest_framework.status import (
    HTTP_400_BAD_REQUEST, HTTP_200_OK, HTTP_201_CREATED, HTTP_500_INTERNAL_SERVER_ERROR
)

from .serializers import PaymentTransactionsSerializer
from .models import PaymentTransactions, ExpenseTypes, PaymentTypes, SubTypes

class TransactionHistory(APIView):

    def get(self, request, *args, **kwargs):
        history = PaymentTransactionsSerializer(
            PaymentTransactions.objects.all().prefetch_related(
                'payment_type', 'expense_type', 'expense_type__master_type'
            ).order_by('-id')[:5], many=True
        ).data
        return Response(data=history, status=HTTP_200_OK)


class PaymentsView(APIView):
    '''This APIView is to interact with Payment Transaction Table'''
    def get(self, request, *args, **kwargs):
        '''This API will give all the Expense List which are not disabled'''
        try:
            _filters = {'is_state': 0}
            category_id = int(request.GET.get('categoryId', 0))
            payment_id = int(request.GET.get('paymentId', 0))
            sub_category = int(request.GET.get('subCatId', 0))
            if category_id:
                _filters['expense_type__master_type__id'] = category_id
            if payment_id:
                _filters['payment_type_id'] = payment_id
            if sub_category:
                _filters['expense_type_id'] = sub_category
            transaction = PaymentTransactions.objects.filter(**_filters).prefetch_related(
                'payment_type', 'expense_type', 'expense_type__master_type'
            ).order_by('-id')
            serializer = PaymentTransactionsSerializer(transaction, many=True).data
            return Response(data=serializer, status=200)
        except Exception as e:
            return Response(
                data="error occured!{}".format(e), status=HTTP_500_INTERNAL_SERVER_ERROR
            )

    @method_decorator(transaction.atomic)
    def post(self, request, *args, **kwargs):
        '''This Api is to Add new Transaction'''
        try:
            amount = float(request.data.get('amount', 0))
            payment_type = int(request.data.get('paymentId', 0))
            expense_type = int(request.data.get('subCategoryId', 0))
            flag = int(request.data.get('transactionType', 0))
            if not all([amount, payment_type, expense_type]):
                raise Exception("Invalid Payload")
            PaymentTransactions.objects.create(
                payment_type_id=payment_type,
                expense_type_id=expense_type,
                amount=amount,
                flag=flag
            )
            return Response(data="success", status=HTTP_201_CREATED)
        except Exception as e:
            return Response(
                data="Error Occured {}".format(e), status=HTTP_500_INTERNAL_SERVER_ERROR
            )    

    def delete(self, request, *args, **kwargs):
        '''This Api is to disable a transaction'''
        try:
            payment_id = kwargs.get('pk', 0)
            if payment_id:
                PaymentTransactions.objects.filter(pk=payment_id).update(is_state=1)
                return Response(data="success", status=HTTP_200_OK)
            return Response(data="No transaction with this id", status=HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response(data="Error Occured", status=HTTP_500_INTERNAL_SERVER_ERROR)


class FilterOptions(APIView):
    '''This API will fetch dropdown options for frontend'''
    def get(self, request, *args, **kwargs):
        '''This API will fetch dropdown options for frontend'''
        expense_catergories = ExpenseTypes.objects.filter(is_state=0).values()
        sub_catergories = SubTypes.objects.filter(is_state=0).values()
        payment_method = PaymentTypes.objects.filter(is_state=0).values()
        return Response(data={
            'expense_catergories' : expense_catergories, 
            'sub_catergories' : sub_catergories, 
            'payment_method' : payment_method
            }, status=HTTP_200_OK
        )


class CatergoryWiseExpense(APIView):
    '''
    This API will return Incoming (credit) and Outgoing (Debit) Expenses,
    currently used for dashboard
    '''
    def get(self, request, *args, **kwargs):
        credit = PaymentTransactions.objects.filter(
            is_state=0, flag=1).values('flag').annotate(totalAmount = Sum(F('amount'))
        )
        debit = PaymentTransactions.objects.filter(is_state=0, flag=0
            ).values('flag').annotate(totalAmount = Sum(F('amount'))
        )
        return Response(data={
            'Incoming': credit,'Outgoing': debit}, status=HTTP_200_OK
        )


class GenerateReports(APIView):

    def _reports(self, report_type, id):
        if report_type == 1:
            return self.sub_category_reports(id)
        if report_type == 2:
            return self.category_reports(id)
        if report_type == 3:
            return self.payment_method_reports(id)


    def sub_category_reports(self, id):
        filters = {'is_state': 0, 'expense_type__is_state': 0}
        if id:
            filters['expense_type_id'] = id
        return PaymentTransactionsSerializer(PaymentTransactions.objects.filter(
            **filters), many=True
        ).data

    def category_reports(self, id):
        filters = {'is_state': 0, 'expense_type__master_type__is_state': 0}
        if id:
            filters['expense_type__master_type__id'] = id
        return PaymentTransactionsSerializer(PaymentTransactions.objects.filter(
            **filters), many=True
        ).data
    
    def payment_method_reports(self, id):
        filters = {'is_state': 0, 'payment_type__is_state': 0}
        if id:
            filters['payment_type__id'] = id
        return PaymentTransactionsSerializer(PaymentTransactions.objects.filter(
            **filters), many=True
        ).data

    def get(self, request):
        try:
            report_type = int(request.GET.get('value', 0))
            id = int(request.GET.get('id', 0))
            wb = xlwt.Workbook()
            ws = wb.add_sheet('expense')
            reports = self._reports(report_type=report_type, id=id)
            ws.write(0, 0, 'Sr No.')
            ws.write(0, 1, 'Sub Category')
            ws.write(0, 2, 'Transaction Date')
            ws.write(0, 3, 'Category')
            ws.write(0, 4, 'Payment Method')
            ws.write(0, 5, 'Transaction Type')
            ws.write(0, 6, 'Amount ($)')
            row = 1
            for report in reports:
                ws.write(row, 0, row)
                ws.write(row, 1, report.get('expense_type').get('name'))
                ws.write(row, 2, report.get('created_at'))
                ws.write(row, 3, report.get('expense_type').get('master_type'
                    ).get('type_name') if report['expense_type'].get('master_type') else '-'
                )
                ws.write(row, 4, report.get('payment_type').get('payment_name'))
                ws.write(row, 5, '{}'.format('Credit' if report.get('flag') else 'Debit'))
                ws.write(row, 6, report.get('amount'))
                row +=1
            fname = "ExpenseList.xls"
            filename = '{}'.format(fname)
            response = HttpResponse(content_type="application/vnd.ms-excel")
            response["Content-Disposition"] = "attachment; filename=%s" % filename
            wb.save(response)
            return response
        except Exception as e:
            return Response('Error Occured', status=HTTP_500_INTERNAL_SERVER_ERROR)


class DashboardChart(APIView):

    def get(self, request, *args, **Kwargs):
        dashboard = PaymentTransactions.objects.filter(
            is_state=0
        ).values('expense_type__master_type').annotate(
            expense_name = F('expense_type__master_type__type_name'),
            credit = Coalesce(
                Sum('amount', filter=Q(flag=1)), Value(0.0), output_field=FloatField()),
            debit = Coalesce(
                Sum('amount', filter=Q(flag=0)), Value(0.0), output_field=FloatField()),
        )
        return Response(data=dashboard, status=HTTP_200_OK)