from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework import status
from .exceptions import (
    GeneNotFoundException,
    InvalidGeneDataException,
    VariantNotFoundException,
    DuplicateGeneException,
    PathwayNotFoundException,
    AssociationNotFoundException
)


def custom_exception_handler(exc, context):
    # Primero intentar con el manejador de DRF
    response = exception_handler(exc, context)

    # Si DRF ya manejo la excepcion, retornarla
    if response is not None:
        return response

    # Manejar excepciones personalizadas (ANTES de que DRF las convierta en 500)
    if isinstance(exc, GeneNotFoundException):
        return Response(
            {
                'error': 'Gene Not Found',
                'detail': str(exc),
                'status_code': 404
            },
            status=status.HTTP_404_NOT_FOUND
        )

    if isinstance(exc, VariantNotFoundException):
        return Response(
            {
                'error': 'Variant Not Found',
                'detail': str(exc),
                'status_code': 404
            },
            status=status.HTTP_404_NOT_FOUND
        )

    if isinstance(exc, PathwayNotFoundException):
        return Response(
            {
                'error': 'Pathway Not Found',
                'detail': str(exc),
                'status_code': 404
            },
            status=status.HTTP_404_NOT_FOUND
        )

    if isinstance(exc, AssociationNotFoundException):
        return Response(
            {
                'error': 'Association Not Found',
                'detail': str(exc),
                'status_code': 404
            },
            status=status.HTTP_404_NOT_FOUND
        )

    if isinstance(exc, DuplicateGeneException):
        return Response(
            {
                'error': 'Duplicate Gene',
                'detail': str(exc),
                'status_code': 409
            },
            status=status.HTTP_409_CONFLICT
        )

    if isinstance(exc, InvalidGeneDataException):
        return Response(
            {
                'error': 'Invalid Data',
                'detail': str(exc),
                'status_code': 400
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    # Para cualquier otra excepcion, dejar que DRF maneje o retornar None
    # para que Django muestre el error real en desarrollo
    return None