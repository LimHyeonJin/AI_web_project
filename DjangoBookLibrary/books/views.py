from django.shortcuts import render, redirect, reverse
from django.urls import reverse_lazy
from django.http import Http404, HttpResponseForbidden
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.views.generic.edit import FormMixin
from django.views.generic import (
    DetailView,
    FormView,
    ListView,
    TemplateView,
    UpdateView)

from .forms import (
    CommentForm,
    CommentUpdateForm
)

from .models import (
    Book,
    BookComment,
    BookReview
)

# Create your views here.

class HomeListView(ListView):
    template_name = 'books/home.html'
    model = Book

    def get_queryset(self):
        queryset = super(HomeListView, self).get_queryset()
        return queryset.all().order_by('-id')[:9]


class SearchBookListView(ListView):
    template_name = "books/book_search_result.html"
    model = Book

    def get_queryset(self):
        queryset = super(SearchBookListView, self).get_queryset()
        q = self.request.GET.get("q")
        if q:
            books_by_title = queryset.filter(title__icontains=q)
            books_by_author = queryset.filter(author__icontains=q)
            return books_by_author | books_by_title
        return queryset


class BookDetailView(FormMixin, DetailView):
    model = Book
    form_class = CommentForm

    def get_success_url(self):
        return reverse('bookDetail', kwargs={'slug': self.object.slug})

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['form'] = self.get_form()
        context['comments'] = BookComment.objects.filter(
            book=self.object).order_by('-id')
        return context

    def post(self, request, *args, **kwargs):
        if not request.user.is_authenticated:
            return HttpResponseForbidden()
        self.object = self.get_object()
        form = self.get_form()
        if form.is_valid():
            return self.form_valid(form)
        else:
            return self.form_invalid(form)

    def form_valid(self, form):
        b = self.get_object()
        text = form.cleaned_data['text']
        new_comment = BookComment(text=text, book=b, user=self.request.user)
        new_comment.save()
        messages.success(self.request, "Your comment is added, thank you")
        return super().form_valid(form)


@login_required(login_url='login')
def login_to_comment_redirect(request, slug):
    return redirect('bookDetail', slug=slug)



class CommentUpdateView(FormMixin, DetailView):
    login_url = "login"
    form_class = CommentUpdateForm
    template_name = 'book/book_detail.html'
    success_url = reverse_lazy('comment_update')

    def form_valid(self, form):
        self.request.book.text = self.request.POST['comment']
        self.request.book.user = self.request.POST['user']
        self.request.book.text.save()
        return super().form_valid(form)

    def get_initial(self):
        initial = super(CommentUpdateView, self).get_initial()
        initial['username'] = self.request.user.username
        initial['email'] = self.request.user.email
        return initial















def rate_book_view(request, slug, rating):
    try:
        b = Book.objects.get(slug=slug)
        if b and not(BookReview.objects.filter(user=request.user).filter(book=b)):
            review = BookReview(book=b, user=request.user, rating=rating)
            review.save()
            b.last_rating = b.calc_rating
            b.save()
            messages.success(
                request, 'You rated a book: {b.title}')

        else:
            messages.warning(
                request, 'You already rated this book')
        return redirect('bookDetail', slug=b.slug)
    except Book.DoesNotExist:
        raise Http404("Book is unavailable")
    return redirect('bookDetail', slug=b.slug)