from rest_framework import viewsets, filters
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Gene, GeneticVariant, PatientVariantReport
from .serializers import GeneSerializer, GeneticVariantSerializer, PatientVariantReportSerializer


class GeneViewSet(viewsets.ModelViewSet):
    """
    ViewSet para Gene - CRUD completo
    Permite buscar por symbol o full_name
    """
    queryset = Gene.objects.all()
    serializer_class = GeneSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['symbol', 'full_name']


class GeneticVariantViewSet(viewsets.ModelViewSet):
    """
    ViewSet para GeneticVariant
    Permite buscar por símbolo de gen, cromosoma o impacto
    """
    queryset = GeneticVariant.objects.select_related('gene').all()
    serializer_class = GeneticVariantSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['gene__symbol', 'chromosome', 'impact']


class PatientVariantReportViewSet(viewsets.ModelViewSet):
    """
    ViewSet para PatientVariantReport
    Incluye endpoint personalizado para obtener reportes por paciente
    """
    queryset = PatientVariantReport.objects.select_related('variant__gene').all()
    serializer_class = PatientVariantReportSerializer

    @action(detail=False, methods=['get'])
    def by_patient(self, request):
        """
        Endpoint personalizado: GET /api/patient-variant-reports/by_patient/?patient_id=xxx
        Retorna todos los reportes de un paciente específico
        """
        patient_id = request.query_params.get('patient_id')
        if not patient_id:
            return Response({'error': 'patient_id parameter is required'}, status=400)

        reports = self.queryset.filter(patient_id=patient_id)
        serializer = self.get_serializer(reports, many=True)
        return Response(serializer.data)