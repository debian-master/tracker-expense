from rest_framework import serializers
from .models import (
    ExpenseTypes, SubTypes, PaymentTypes, PaymentTransactions
    )

class ExpenseTypeSerializer(serializers.ModelSerializer):

    class Meta:
        model = ExpenseTypes
        fields = '__all__'

class SubTypesSerializer(serializers.ModelSerializer):
    master_type = ExpenseTypeSerializer()

    class Meta:
        model = SubTypes
        fields = '__all__'

class PaymentTypesSerializer(serializers.ModelSerializer):

    class Meta:
        model = PaymentTypes
        fields = '__all__'

class PaymentTransactionsSerializer(serializers.ModelSerializer):
    payment_type = PaymentTypesSerializer()
    expense_type = SubTypesSerializer()

    class Meta:
        model = PaymentTransactions
        fields = '__all__'