from rest_framework import serializers
from .models import Gene, GeneticVariant, PatientVariantReport


# ============================================================================
# DTOs de INPUT (Lo que recibimos en POST/PUT)
# ============================================================================

class GeneInputSerializer(serializers.Serializer):
    """
    DTO para crear/actualizar genes
    Solo acepta los campos necesarios, NO expone campos internos
    """
    symbol = serializers.CharField(max_length=20, required=True)
    full_name = serializers.CharField(max_length=200, required=True)
    function_summary = serializers.CharField(required=True)

    def create(self, validated_data):
        return Gene.objects.create(**validated_data)

    def update(self, instance, validated_data):
        instance.symbol = validated_data.get('symbol', instance.symbol)
        instance.full_name = validated_data.get('full_name', instance.full_name)
        instance.function_summary = validated_data.get('function_summary', instance.function_summary)
        instance.save()
        return instance


class GeneticVariantInputSerializer(serializers.Serializer):
    """
    DTO para crear/actualizar variantes genéticas
    """
    gene_id = serializers.IntegerField(required=True)
    chromosome = serializers.CharField(max_length=10, required=True)
    position = serializers.IntegerField(required=True)
    reference_base = serializers.CharField(max_length=500, required=True)
    alternate_base = serializers.CharField(max_length=500, required=True)
    impact = serializers.ChoiceField(
        choices=['Missense', 'Nonsense', 'Frameshift', 'Silent', 'Splice Site', 'Otros'],
        required=True
    )

    def create(self, validated_data):
        gene_id = validated_data.pop('gene_id')
        gene = Gene.objects.get(id=gene_id)
        return GeneticVariant.objects.create(gene=gene, **validated_data)

    def update(self, instance, validated_data):
        if 'gene_id' in validated_data:
            gene = Gene.objects.get(id=validated_data.pop('gene_id'))
            instance.gene = gene

        instance.chromosome = validated_data.get('chromosome', instance.chromosome)
        instance.position = validated_data.get('position', instance.position)
        instance.reference_base = validated_data.get('reference_base', instance.reference_base)
        instance.alternate_base = validated_data.get('alternate_base', instance.alternate_base)
        instance.impact = validated_data.get('impact', instance.impact)
        instance.save()
        return instance


class PatientVariantReportInputSerializer(serializers.Serializer):
    """
    DTO para crear/actualizar reportes de pacientes
    """
    patient_id = serializers.UUIDField(required=True)
    variant_id = serializers.UUIDField(required=True)
    detection_date = serializers.DateField(required=True)
    allele_frequency = serializers.DecimalField(max_digits=5, decimal_places=4, required=True)

    def validate_allele_frequency(self, value):
        if value < 0 or value > 1:
            raise serializers.ValidationError("Allele frequency must be between 0 and 1")
        return value

    def create(self, validated_data):
        variant_id = validated_data.pop('variant_id')
        variant = GeneticVariant.objects.get(id=variant_id)
        return PatientVariantReport.objects.create(variant=variant, **validated_data)

    def update(self, instance, validated_data):
        if 'variant_id' in validated_data:
            variant = GeneticVariant.objects.get(id=validated_data.pop('variant_id'))
            instance.variant = variant

        instance.patient_id = validated_data.get('patient_id', instance.patient_id)
        instance.detection_date = validated_data.get('detection_date', instance.detection_date)
        instance.allele_frequency = validated_data.get('allele_frequency', instance.allele_frequency)
        instance.save()
        return instance


# ============================================================================
# DTOs de OUTPUT (Lo que enviamos en respuestas GET)
# ============================================================================

class GeneOutputSerializer(serializers.Serializer):
    """
    DTO para respuestas de genes
    SOLO expone campos públicos, NO expone created_at/updated_at
    """
    id = serializers.IntegerField(read_only=True)
    symbol = serializers.CharField()
    full_name = serializers.CharField()
    function_summary = serializers.CharField()


class GeneticVariantOutputSerializer(serializers.Serializer):
    """
    DTO para respuestas de variantes genéticas
    Incluye información del gen relacionado (anidado)
    """
    id = serializers.UUIDField(read_only=True)
    gene_id = serializers.IntegerField(source='gene.id')
    gene_symbol = serializers.CharField(source='gene.symbol')
    gene_name = serializers.CharField(source='gene.full_name')
    chromosome = serializers.CharField()
    position = serializers.IntegerField()
    reference_base = serializers.CharField()
    alternate_base = serializers.CharField()
    impact = serializers.CharField()


class PatientVariantReportOutputSerializer(serializers.Serializer):
    """
    DTO para respuestas de reportes de pacientes
    Incluye información completa de la variante (anidado)
    """
    id = serializers.UUIDField(read_only=True)
    patient_id = serializers.UUIDField()
    detection_date = serializers.DateField()
    allele_frequency = serializers.DecimalField(max_digits=5, decimal_places=4)

    # Información anidada de la variante
    variant_id = serializers.UUIDField(source='variant.id')
    gene_symbol = serializers.CharField(source='variant.gene.symbol')
    chromosome = serializers.CharField(source='variant.chromosome')
    position = serializers.IntegerField(source='variant.position')
    impact = serializers.CharField(source='variant.impact')