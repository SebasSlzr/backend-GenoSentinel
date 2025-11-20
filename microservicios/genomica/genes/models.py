import uuid
from django.db import models


class Gene(models.Model):
    """Gen de Interés - Catálogo de genes relevantes en oncología"""
    symbol = models.CharField(max_length=20, unique=True)
    full_name = models.CharField(max_length=200)
    function_summary = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'genes'

    def __str__(self):
        return self.symbol


class GeneticVariant(models.Model):
    """Variante Genética - Registro de una mutación específica"""
    MISSENSE = 'Missense'
    NONSENSE = 'Nonsense'
    FRAMESHIFT = 'Frameshift'
    SILENT = 'Silent'
    SPLICE_SITE = 'Splice Site'
    OTROS = 'Otros'

    IMPACT_CHOICES = [
        (MISSENSE, 'Missense'),
        (NONSENSE, 'Nonsense'),
        (FRAMESHIFT, 'Frameshift'),
        (SILENT, 'Silent'),
        (SPLICE_SITE, 'Splice Site'),
        (OTROS, 'Otros'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    gene = models.ForeignKey(Gene, on_delete=models.CASCADE)
    chromosome = models.CharField(max_length=10)
    position = models.BigIntegerField()
    reference_base = models.CharField(max_length=500)
    alternate_base = models.CharField(max_length=500)
    impact = models.CharField(max_length=20, choices=IMPACT_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'genetic_variants'

    def __str__(self):
        return f"{self.chromosome}:{self.position}"


class PatientVariantReport(models.Model):
    """Reporte de Variantes del Paciente - Librería de mutaciones"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    patient_id = models.UUIDField()
    variant = models.ForeignKey(GeneticVariant, on_delete=models.CASCADE)
    detection_date = models.DateField()
    allele_frequency = models.DecimalField(max_digits=5, decimal_places=4)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'patient_variant_reports'

    def __str__(self):
        return f"Report {self.id}"