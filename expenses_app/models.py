from django.db import models

class ExpenseTypes(models.Model):
    id = models.AutoField(primary_key=True, max_length=11)
    type_name = models.CharField(max_length=255, blank=False)
    is_state = models.IntegerField(default=0) # 0 - Not Disable, 1 - Disabled
    created_at = models.DateTimeField(auto_now_add=True, blank=True, null=True)
    updated_at = models.DateTimeField(auto_now=True, blank=True, null=True)

    class Meta:
        db_table = 'ExpenseTypes'

class SubTypes(models.Model):
    id = models.AutoField(primary_key=True, max_length=11)
    master_type = models.ForeignKey(ExpenseTypes, blank=False, on_delete=models.CASCADE)
    name = models.CharField(max_length=255, blank=False)
    is_state = models.IntegerField(default=0) # 0 - Not Disable, 1 - Disabled
    created_at = models.DateTimeField(auto_now_add=True, blank=True, null=True)
    updated_at = models.DateTimeField(auto_now=True, blank=True, null=True)

    class Meta:
        db_table = 'SubTypes'

class PaymentTypes(models.Model):
    id = models.AutoField(primary_key=True, max_length=11)
    payment_name = models.CharField(max_length=255)
    is_state = models.IntegerField(default=0) # 0 - Not Disable, 1 - Disabled
    created_at = models.DateTimeField(auto_now_add=True, blank=True, null=True)
    updated_at = models.DateTimeField(auto_now=True, blank=True, null=True)

    class Meta:
        db_table = 'PaymentTypes'

class PaymentTransactions(models.Model):
    id = models.AutoField(primary_key=True, max_length=11)
    payment_type = models.ForeignKey(PaymentTypes, blank=False, on_delete=models.CASCADE)
    expense_type = models.ForeignKey(SubTypes, blank=True, null=True, on_delete=models.CASCADE)
    is_state = models.IntegerField(default=0) # 0 - Not Disable, 1 - Disabled
    flag = models.IntegerField(default=0) # 0 - Debit, 1 - Credit
    amount = models.FloatField()
    created_at = models.DateTimeField(auto_now_add=True, blank=True, null=True)
    updated_at = models.DateTimeField(auto_now=True, blank=True, null=True)

    class Meta:
        db_table = 'PaymentTransactions' 

