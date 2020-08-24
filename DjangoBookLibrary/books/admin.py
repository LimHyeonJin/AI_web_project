from django.contrib import admin
from .models import Book

# Register your models here.


@admin.register(Book)
class BookAdmin(admin.ModelAdmin):
    fields = ('title', 'author', 'image', 'description', 'publish_date')
    list_display = ('title', 'author')
    search_fields = ['title']

