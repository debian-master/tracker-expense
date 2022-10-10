from django.contrib import admin
from django.urls import path

from expenses_app.views import (
    TransactionHistory, PaymentsView, FilterOptions, CatergoryWiseExpense, 
    GenerateReports
)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('get-history/',TransactionHistory.as_view()),
    path('get-transactions/',PaymentsView.as_view()),
    path('delete/',PaymentsView.as_view()),
    path('add-new-transaction/',PaymentsView.as_view()),
    path('get-filters/', FilterOptions.as_view()),
    path('get-transation-type-data/', CatergoryWiseExpense.as_view()),
    path('get-category-filters/', FilterOptions.as_view()),
    path('get-reports/',GenerateReports.as_view()),
]
