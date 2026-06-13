from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.test import APITestCase

User = get_user_model()


class AccountApiTests(APITestCase):
    def setUp(self):
        self.admin = User.objects.create_user(
            username='admin',
            password='AdminPass123!',
            role='admin',
        )
        self.student = User.objects.create_user(
            username='student',
            password='StudentPass123!',
            role='student',
        )

    def authenticate(self, username, password):
        response = self.client.post(
            '/api/token/',
            {'username': username, 'password': password},
            format='json',
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.client.credentials(
            HTTP_AUTHORIZATION=f"Bearer {response.data['access']}"
        )

    def test_authenticated_user_can_read_and_update_profile(self):
        self.authenticate('student', 'StudentPass123!')

        response = self.client.patch(
            '/api/me/',
            {'first_name': 'An', 'email': 'an@example.com'},
            format='json',
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.student.refresh_from_db()
        self.assertEqual(self.student.first_name, 'An')
        self.assertEqual(self.student.email, 'an@example.com')

    def test_student_cannot_list_users(self):
        self.authenticate('student', 'StudentPass123!')

        response = self.client.get('/api/users/')

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_admin_can_create_update_and_delete_user(self):
        self.authenticate('admin', 'AdminPass123!')

        create_response = self.client.post(
            '/api/users/',
            {
                'username': 'teacher',
                'password': 'TeacherPass123!',
                'role': 'teacher',
                'email': 'teacher@example.com',
            },
            format='json',
        )
        self.assertEqual(create_response.status_code, status.HTTP_201_CREATED)
        user_id = create_response.data['id']

        update_response = self.client.patch(
            f'/api/users/{user_id}/',
            {'first_name': 'Minh'},
            format='json',
        )
        self.assertEqual(update_response.status_code, status.HTTP_200_OK)

        delete_response = self.client.delete(f'/api/users/{user_id}/')
        self.assertEqual(delete_response.status_code, status.HTTP_204_NO_CONTENT)

    def test_admin_cannot_delete_current_account(self):
        self.authenticate('admin', 'AdminPass123!')

        response = self.client.delete(f'/api/users/{self.admin.pk}/')

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
