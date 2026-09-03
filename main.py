from router import Router

from pages.home import page_home
from pages.tourism import page_tourism
from pages.businesses import page_businesses
from pages.products import page_products
from pages.services import page_services
from pages.projects import page_projects
from pages.portfolio import page_portfolio
from pages.about import page_about
from pages.contact import page_contact
from pages.search import page_search

class App:
    def __init__(self):
        self.router = Router()
        self.register_pages()

    def register_pages(self):
        self.router.register("home", page_home)
        self.router.register("tourism", page_tourism)
        self.router.register("businesses", page_businesses)
        self.router.register("products", page_products)
        self.router.register("services", page_services)
        self.router.register("projects", page_projects)
        self.router.register("portfolio", page_portfolio)
        self.router.register("about", page_about)
        self.router.register("contact", page_contact)
        self.router.register("search", page_search)

    def open_page(self, name):
        self.router.open(name)


app = App()

# مثال فتح أي صفحة:
app.open_page("tourism")
from src.multilingual_core import build_reply

def main():
    print("🌍 نظام كشف لغة عالمي (باستخدام FastText lid.176.ftz)")
    print("اكتب أي نص بأي لغة (اكتب quit للخروج)\n")

    while True:
        msg = input("أنت: ").strip()
        if msg.lower() == "quit":
            break
        if not msg:
            continue

        reply = build_reply(msg)
        print("النظام:", reply, "\n")


if __name__ == "__main__":
    main()
