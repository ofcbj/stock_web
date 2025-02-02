"""api URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from rest_framework.routers import DefaultRouter
#from rest_framework_simplejwt.views import obtain_jwt_token, refresh_jwt_token, verify_jwt_token
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView, TokenVerifyView
from member.views import member_search, sector_list, sector_company_list

router = DefaultRouter()

urlpatterns = [
    path('admin/', admin.site.urls),
    #path('api-token-auth/', obtain_jwt_token),
    #path('api-token-refresh/', refresh_jwt_token),
    #path('api-token-verify/', verify_jwt_token),
    path('api-token-auth/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api-token-refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api-token-verify/', TokenVerifyView.as_view(), name='token_verify'),
    path('member_search/', member_search),
    path('sector_list/', sector_list),
    path('sector_company_list/', sector_company_list),
]

urlpatterns += router.urls
