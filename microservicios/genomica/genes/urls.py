from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import GeneViewSet, GeneticVariantViewSet, PatientVariantReportViewSet

router = DefaultRouter()
router.register(r'genes', GeneViewSet, basename='gene')
router.register(r'genetic-variants', GeneticVariantViewSet, basename='geneticvariant')
router.register(r'patient-variant-reports', PatientVariantReportViewSet, basename='patientvariantreport')

urlpatterns = [
    path('', include(router.urls)),
]