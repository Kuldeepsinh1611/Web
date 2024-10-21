from django.shortcuts import render

# Create your views here.
from rest_framework.response import Response
from django.http import JsonResponse
from rest_framework.views import APIView
from .serializers import AppointmentSerializer
from .models import Appointment
    
class BookAppointmentView(APIView):
    def post(self,request):
        print(request.data)
        serializer=AppointmentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            print('Appointment Booked')
            return Response({'message':'successful'})
        return Response(serializer.errors,status=400)

    