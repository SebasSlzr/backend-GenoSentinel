# genes/views.py

from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.core.exceptions import ValidationError

from .models import Gene, GeneticVariant, PatientVariantReport
from .serializers import (
    GeneInputSerializer, GeneOutputSerializer,
    GeneticVariantInputSerializer, GeneticVariantOutputSerializer,
    PatientVariantReportInputSerializer, PatientVariantReportOutputSerializer
)
from .exceptions import (
    GeneNotFoundException,
    VariantNotFoundException,
    AssociationNotFoundException,
    DuplicateGeneException,
    InvalidGeneDataException
)


class GeneViewSet(viewsets.ViewSet):
    """
    ViewSet para Gene con DTOs explicitos
    Input y Output separados para mejor control
    """

    def list(self, request):
        """GET /genes/ - Listar todos los genes"""
        genes = Gene.objects.all()
        serializer = GeneOutputSerializer(genes, many=True)
        return Response(serializer.data)

    def create(self, request):
        """POST /genes/ - Crear nuevo gen"""
        # Validar si ya existe un gen con el mismo simbolo
        symbol = request.data.get('symbol')
        if symbol and Gene.objects.filter(symbol=symbol).exists():
            raise DuplicateGeneException(symbol=symbol)

        serializer = GeneInputSerializer(data=request.data)
        if serializer.is_valid():
            gene = serializer.save()
            output_serializer = GeneOutputSerializer(gene)
            return Response(output_serializer.data, status=status.HTTP_201_CREATED)

        # Lanzar excepcion con detalles de validacion
        raise InvalidGeneDataException(
            field='datos del gen',
            reason=str(serializer.errors)
        )

    def retrieve(self, request, pk=None):
        """GET /genes/{id}/ - Obtener un gen especifico"""
        try:
            gene = Gene.objects.get(pk=pk)
            serializer = GeneOutputSerializer(gene)
            return Response(serializer.data)
        except (ValidationError, Gene.DoesNotExist):
            raise GeneNotFoundException(gene_id=pk)

    def update(self, request, pk=None):
        """PUT /genes/{id}/ - Actualizar gen completo"""
        try:
            gene = Gene.objects.get(pk=pk)
        except (ValidationError, Gene.DoesNotExist):
            raise GeneNotFoundException(gene_id=pk)

        serializer = GeneInputSerializer(gene, data=request.data)
        if serializer.is_valid():
            updated_gene = serializer.save()
            output_serializer = GeneOutputSerializer(updated_gene)
            return Response(output_serializer.data)

        raise InvalidGeneDataException(
            field='datos del gen',
            reason=str(serializer.errors)
        )

    def partial_update(self, request, pk=None):
        """PATCH /genes/{id}/ - Actualizar parcialmente"""
        try:
            gene = Gene.objects.get(pk=pk)
        except (ValidationError, Gene.DoesNotExist):
            raise GeneNotFoundException(gene_id=pk)

        serializer = GeneInputSerializer(gene, data=request.data, partial=True)
        if serializer.is_valid():
            updated_gene = serializer.save()
            output_serializer = GeneOutputSerializer(updated_gene)
            return Response(output_serializer.data)

        raise InvalidGeneDataException(
            field='datos del gen',
            reason=str(serializer.errors)
        )

    def destroy(self, request, pk=None):
        """DELETE /genes/{id}/ - Eliminar gen"""
        try:
            gene = Gene.objects.get(pk=pk)
            gene.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except (ValidationError, Gene.DoesNotExist):
            raise GeneNotFoundException(gene_id=pk)


class GeneticVariantViewSet(viewsets.ViewSet):
    """
    ViewSet para GeneticVariant con DTOs explicitos
    """

    def list(self, request):
        """GET /genetic-variants/ - Listar variantes"""
        variants = GeneticVariant.objects.select_related('gene').all()
        serializer = GeneticVariantOutputSerializer(variants, many=True)
        return Response(serializer.data)

    def create(self, request):
        """POST /genetic-variants/ - Crear variante"""
        serializer = GeneticVariantInputSerializer(data=request.data)
        if serializer.is_valid():
            variant = serializer.save()
            output_serializer = GeneticVariantOutputSerializer(variant)
            return Response(output_serializer.data, status=status.HTTP_201_CREATED)

        raise InvalidGeneDataException(
            field='datos de variante',
            reason=str(serializer.errors)
        )

    def retrieve(self, request, pk=None):
        """GET /genetic-variants/{id}/ - Obtener variante"""
        try:
            variant = GeneticVariant.objects.select_related('gene').get(pk=pk)
            serializer = GeneticVariantOutputSerializer(variant)
            return Response(serializer.data)
        except (ValidationError, GeneticVariant.DoesNotExist):
            raise VariantNotFoundException(variant_id=pk)

    def update(self, request, pk=None):
        """PUT /genetic-variants/{id}/ - Actualizar variante"""
        try:
            variant = GeneticVariant.objects.get(pk=pk)
        except (ValidationError, GeneticVariant.DoesNotExist):
            raise VariantNotFoundException(variant_id=pk)

        serializer = GeneticVariantInputSerializer(variant, data=request.data)
        if serializer.is_valid():
            updated_variant = serializer.save()
            output_serializer = GeneticVariantOutputSerializer(updated_variant)
            return Response(output_serializer.data)

        raise InvalidGeneDataException(
            field='datos de variante',
            reason=str(serializer.errors)
        )

    def partial_update(self, request, pk=None):
        """PATCH /genetic-variants/{id}/"""
        try:
            variant = GeneticVariant.objects.get(pk=pk)
        except (ValidationError, GeneticVariant.DoesNotExist):
            raise VariantNotFoundException(variant_id=pk)

        serializer = GeneticVariantInputSerializer(variant, data=request.data, partial=True)
        if serializer.is_valid():
            updated_variant = serializer.save()
            output_serializer = GeneticVariantOutputSerializer(updated_variant)
            return Response(output_serializer.data)

        raise InvalidGeneDataException(
            field='datos de variante',
            reason=str(serializer.errors)
        )

    def destroy(self, request, pk=None):
        """DELETE /genetic-variants/{id}/"""
        try:
            variant = GeneticVariant.objects.get(pk=pk)
            variant.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except (ValidationError, GeneticVariant.DoesNotExist):
            raise VariantNotFoundException(variant_id=pk)


class PatientVariantReportViewSet(viewsets.ViewSet):
    """
    ViewSet para PatientVariantReport con DTOs explicitos
    """

    def list(self, request):
        """GET /patient-variant-reports/ - Listar reportes"""
        reports = PatientVariantReport.objects.select_related('variant__gene').all()
        serializer = PatientVariantReportOutputSerializer(reports, many=True)
        return Response(serializer.data)

    def create(self, request):
        """POST /patient-variant-reports/ - Crear reporte"""
        serializer = PatientVariantReportInputSerializer(data=request.data)
        if serializer.is_valid():
            report = serializer.save()
            output_serializer = PatientVariantReportOutputSerializer(report)
            return Response(output_serializer.data, status=status.HTTP_201_CREATED)

        raise InvalidGeneDataException(
            field='datos de reporte',
            reason=str(serializer.errors)
        )

    def retrieve(self, request, pk=None):
        """GET /patient-variant-reports/{id}/"""
        try:
            report = PatientVariantReport.objects.select_related('variant__gene').get(pk=pk)
            serializer = PatientVariantReportOutputSerializer(report)
            return Response(serializer.data)
        except (ValidationError, PatientVariantReport.DoesNotExist):
            raise AssociationNotFoundException(association_id=pk)

    def update(self, request, pk=None):
        """PUT /patient-variant-reports/{id}/"""
        try:
            report = PatientVariantReport.objects.get(pk=pk)
        except (ValidationError, PatientVariantReport.DoesNotExist):
            raise AssociationNotFoundException(association_id=pk)

        serializer = PatientVariantReportInputSerializer(report, data=request.data)
        if serializer.is_valid():
            updated_report = serializer.save()
            output_serializer = PatientVariantReportOutputSerializer(updated_report)
            return Response(output_serializer.data)

        raise InvalidGeneDataException(
            field='datos de reporte',
            reason=str(serializer.errors)
        )

    def partial_update(self, request, pk=None):
        """PATCH /patient-variant-reports/{id}/"""
        try:
            report = PatientVariantReport.objects.get(pk=pk)
        except (ValidationError, PatientVariantReport.DoesNotExist):
            raise AssociationNotFoundException(association_id=pk)

        serializer = PatientVariantReportInputSerializer(report, data=request.data, partial=True)
        if serializer.is_valid():
            updated_report = serializer.save()
            output_serializer = PatientVariantReportOutputSerializer(updated_report)
            return Response(output_serializer.data)

        raise InvalidGeneDataException(
            field='datos de reporte',
            reason=str(serializer.errors)
        )

    def destroy(self, request, pk=None):
        """DELETE /patient-variant-reports/{id}/"""
        try:
            report = PatientVariantReport.objects.get(pk=pk)
            report.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except (ValidationError, PatientVariantReport.DoesNotExist):
            raise AssociationNotFoundException(association_id=pk)

    @action(detail=False, methods=['get'])
    def by_patient(self, request):
        """
        GET /patient-variant-reports/by_patient/?patient_id=xxx
        Endpoint personalizado para filtrar por paciente
        """
        patient_id = request.query_params.get('patient_id')
        if not patient_id:
            raise InvalidGeneDataException(
                field='patient_id',
                reason='El parametro patient_id es requerido'
            )

        reports = PatientVariantReport.objects.select_related('variant__gene').filter(patient_id=patient_id)
        serializer = PatientVariantReportOutputSerializer(reports, many=True)
        return Response(serializer.data)