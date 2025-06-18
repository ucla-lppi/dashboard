# pip install locust && curl -o locustfile.py https://gist.githubusercontent.com/yourusername/yourgistid/raw/locustfile.py && locust

import random
from locust import HttpUser, task, between

PDF_PATHS = [
    "/factsheets/extremeheat/Contra_Costa_extremeheat_2025.pdf",
    "/factsheets/extremeheat/Los_Angeles_extremeheat_2025.pdf",
    "/factsheets/airpollution/Orange_airpollution_2025.pdf",
    # Add more PDF paths as needed
]

ENDPOINTS = [
    "/",
    "/impact/newsroom",
    "/about/our-team",
    "/resource-directory",
    "/faqs",
    # Add more endpoints as needed
]

class WebsiteUser(HttpUser):
    wait_time = between(1, 3)

    @task(3)
    def random_endpoint(self):
        path = random.choice(ENDPOINTS)
        self.client.get(path)

    @task(1)
    def random_pdf(self):
        path = random.choice(PDF_PATHS)
        self.client.get(path)