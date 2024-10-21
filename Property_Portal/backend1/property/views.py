from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.http import JsonResponse 
from .models import Property, PropertyImage, NearbyPlace
from .serializers import PropertySerializer,PropertyDetailSerializer
from account.models import Agent, Client
import ast

class PropertyView(APIView):
    def get(self, request):
        properties = Property.objects.all()
        serializer = PropertySerializer(properties, many=True)
        return Response(serializer.data)

class FindPropertyView(APIView):
    def get(self, request, id):
        try:
            property_instance = Property.objects.get(pk=id)
        except Property.DoesNotExist:
            return Response({'error': 'Property not found'}, status=status.HTTP_404_NOT_FOUND)

        serializer = PropertySerializer(property_instance)
        return Response(serializer.data)

class SavePropertyView(APIView):
    def post(self, request):
        if Property.objects.filter(title=request.data.get("title")).exists():
            return JsonResponse({"message": "Property with this title already exists."}, status=400)
        
        # Extract non-file data
        property_data = {key: value for key, value in request.data.items() if key not in ['nearbyplace', 'images']}
        serializer = PropertySerializer(data=property_data)
        
        if serializer.is_valid():
            property_instance = serializer.save()
            print(property_data)
            
            images = request.FILES.getlist("images")
            if images:
                for image in images:
                    PropertyImage.objects.create(property=property_instance, image=image)
                print('Images Added')
            nearbyplaces = request.data['nearbyplace']
            if isinstance(nearbyplaces, str):
                nearbyplaces = ast.literal_eval(nearbyplaces)

            for np in nearbyplaces:
                NearbyPlace.objects.create(
                    property=property_instance,
                    name=np.get("name", ""),
                    distance=np.get("distance", 0),
                    place_type=np.get("place_type", "")
                )
            print("NearbyPlaces Added")

            owner=Client.objects.get(user=property_data['owner'])
            owner.sell_property.add(property_instance)
            print('Property Added In Owners Selling List')

            agent=Agent.objects.get(user=property_data['agent'])
            agent.inquiry_property.add(property_instance)
            print('Property Added In Agents Inquiry List')

            return Response({"message": "Property details submitted. It will show in listings after verification."}, status=200)
        property=property.objects.get(pk=property_instance)
        property.delete() 
        return Response(serializer.errors, status=400)
    
class PropertyDetailView(APIView):
    def post(self,request):
        try:
            print(request.data)
            serializer1,serializer2={'data':''},{'data':''}
            properties1=Property.objects.filter(pk__in=request.data.get('list1'))
            serializer1=PropertyDetailSerializer(properties1,many=True)
            print(serializer1.data)
            properties2=Property.objects.filter(pk__in=request.data.get('list2'))
            serializer2=PropertyDetailSerializer(properties2,many=True)
            print(serializer2.data)
            return Response({'list1':serializer1.data,'list2':serializer2.data})
        except Property.DoesNotExist:
            return Response({'error': 'Property not found'}, status=status.HTTP_404_NOT_FOUND)
        