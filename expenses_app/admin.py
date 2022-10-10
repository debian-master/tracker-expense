from django.contrib import admin
from .models import (
    ExpenseTypes, SubTypes, PaymentTypes, PaymentTransactions
)

# Register your models here.
admin.site.register(ExpenseTypes)
admin.site.register(SubTypes)
admin.site.register(PaymentTypes)
admin.site.register(PaymentTransactions)