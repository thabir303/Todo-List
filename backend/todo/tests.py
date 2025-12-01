from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from .models import Todo


class TodoModelTestCase(TestCase):
    def test_str_method(self):
        todo = Todo.objects.create(title="Test String", description="desc")
        self.assertEqual(str(todo), "Test String")


class TodoAPITestCase(APITestCase):
    def setUp(self):
        self.list_url = reverse('todo-list')
        self.todo_check = Todo.objects.create(
            title="test todo",
            description="test description",
            completed=False
        )
    
    def test_add_todo(self):
        payload = {
            "title": "new todo",
            "description": "new description",
            "completed": False
        }
        response = self.client.post(self.list_url, payload)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Todo.objects.count(),2)
    
    def test_get_todos(self):
        response = self.client.get(self.list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(response.data),1)

    def test_get_todo_detail(self):
        detail_url = reverse('todo-detail', args=[self.todo_check.id])
        response = self.client.get(detail_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], self.todo_check.title)
        self.assertEqual(response.data['description'], self.todo_check.description)
        self.assertEqual(response.data['completed'], self.todo_check.completed)

    def test_update_todo(self):
        detail_url = reverse('todo-detail',args=[self.todo_check.id])
        payload = {
            "title": "updated todo",
            "description": "updated description",
            "completed": True
        }

        response = self.client.put(detail_url, payload)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], "updated todo")
        self.assertEqual(response.data['description'], "updated description")
        self.assertEqual(response.data['completed'], True)


    def test_delete_todo(self):
        detail_url = reverse('todo-detail',args=[self.todo_check.id])
        response = self.client.delete(detail_url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Todo.objects.count(),0)
    