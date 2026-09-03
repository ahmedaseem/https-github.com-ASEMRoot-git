class Router:
    def __init__(self):
        self.pages = {}

    def register(self, name, func):
        self.pages[name] = func

    def open(self, name):
        page = self.pages.get(name)
        if page:
            print(f"\n=== فتح صفحة: {name} ===\n")
            return page()
        else:
            print(f"⚠️ الصفحة '{name}' غير موجودة")
