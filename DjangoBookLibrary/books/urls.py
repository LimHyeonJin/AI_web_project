from django.conf import settings
from django.conf.urls.static import static
from django.urls import path

from .views import (
    BookDetailView,
    HomeListView,
    login_to_comment_redirect,
    CommentUpdateView,
    rate_book_view,
    SearchBookListView,
)


urlpatterns = [
    path('', HomeListView.as_view(), name='home'),
    path('search-book-results/', SearchBookListView.as_view(), name='search'),
    path('book/<slug:slug>',
         BookDetailView.as_view(), name='bookDetail'),
    path('book/<slug:slug>/<update>/<int:comment_id>', CommentUpdateView.as_view(), name='comment_update'),
    path('book/<slug:slug>/<rating>', rate_book_view, name='rate_book'),
    path('redirect-to-detail/<slug:slug>', login_to_comment_redirect,
         name='login_to_comment_redirect')
]
