# genes/exceptions.py

class GeneNotFoundException(Exception):
    """Excepcion cuando un gen no se encuentra en la base de datos"""
    def __init__(self, gene_id=None, symbol=None):
        if gene_id:
            self.message = f"Gen con ID {gene_id} no encontrado"
        elif symbol:
            self.message = f"Gen con simbolo {symbol} no encontrado"
        else:
            self.message = "Gen no encontrado"
        super().__init__(self.message)


class VariantNotFoundException(Exception):
    """Excepcion cuando una variante genetica no se encuentra"""
    def __init__(self, variant_id=None):
        if variant_id:
            self.message = f"Variante genetica con ID {variant_id} no encontrada"
        else:
            self.message = "Variante genetica no encontrada"
        super().__init__(self.message)


class InvalidGeneDataException(Exception):
    """Excepcion cuando los datos del gen son invalidos"""
    def __init__(self, field=None, reason=None):
        if field and reason:
            self.message = f"Dato invalido en campo '{field}': {reason}"
        else:
            self.message = "Datos del gen invalidos"
        super().__init__(self.message)


class DuplicateGeneException(Exception):
    """Excepcion cuando se intenta crear un gen que ya existe"""
    def __init__(self, symbol):
        self.message = f"El gen con simbolo '{symbol}' ya existe en la base de datos"
        super().__init__(self.message)


class PathwayNotFoundException(Exception):
    """Excepcion cuando una ruta metabolica no se encuentra"""
    def __init__(self, pathway_id=None, name=None):
        if pathway_id:
            self.message = f"Ruta metabolica con ID {pathway_id} no encontrada"
        elif name:
            self.message = f"Ruta metabolica '{name}' no encontrada"
        else:
            self.message = "Ruta metabolica no encontrada"
        super().__init__(self.message)


class AssociationNotFoundException(Exception):
    """Excepcion cuando una asociacion/reporte no se encuentra"""
    def __init__(self, association_id=None):
        if association_id:
            self.message = f"Reporte/Asociacion con ID {association_id} no encontrado"
        else:
            self.message = "Reporte/Asociacion no encontrado"
        super().__init__(self.message)