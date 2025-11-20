from rest_framework import serializers
from .models import Gene, GeneticVariant, PatientVariantReport


class GeneSerializer(serializers.ModelSerializer):
    """
    Serializer para Gen de Interés
    Documento: Página 3 - Transformación mediante DTOs
    """
    class Meta:
        model = Gene
        fields = ['id', 'symbol', 'full_name', 'function_summary', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class GeneticVariantSerializer(serializers.ModelSerializer):
    """
    Serializer para Variante Genética
    Incluye información anidada del gen relacionado
    """
    gene_symbol = serializers.CharField(source='gene.symbol', read_only=True)
    gene_name = serializers.CharField(source='gene.full_name', read_only=True)

    class Meta:
        model = GeneticVariant
        fields = [
            'id', 'gene', 'gene_symbol', 'gene_name',
            'chromosome', 'position', 'reference_base', 'alternate_base',
            'impact', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def validate_allele_frequency(self, value):
        """Validar que VAF esté entre 0 y 1"""
        if value < 0 or value > 1:
            raise serializers.ValidationError("La frecuencia alélica debe estar entre 0 y 1")
        return value


class PatientVariantReportSerializer(serializers.ModelSerializer):
    """
    Serializer para Reporte de Variantes del Paciente
    Documento: Página 3 - Asociar variantes a pacientes
    """
    variant_details = GeneticVariantSerializer(source='variant', read_only=True)

    class Meta:
        model = PatientVariantReport
        fields = [
            'id', 'patient_id', 'variant', 'variant_details',
            'detection_date', 'allele_frequency', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def validate_allele_frequency(self, value):
        """Validar que VAF esté entre 0 y 1"""
        if value < 0 or value > 1:
            raise serializers.ValidationError("Allele frequency must be between 0 and 1")
        return value