def build_icon_dashboard(self):

    container = tk.Frame(self.content)
    container.pack(
        fill="both",
        expand=True,
        padx=30,
        pady=20
    )

    columns = 4

    for index, (icon, title, page) in enumerate(ICONS):

        row = index // columns
        col = index % columns

        card = tk.Frame(
            container,
            relief="solid",
            bd=1,
            padx=15,
            pady=20,
            cursor="hand2"
        )

        card.grid(
            row=row,
            column=col,
            padx=10,
            pady=10,
            sticky="nsew"
        )

        container.grid_columnconfigure(
            col,
            weight=1
        )

        container.grid_rowconfigure(
            row,
            weight=1
        )

        tk.Label(
            card,
            text=icon,
            font=("Segoe UI Emoji", 36)
        ).pack()

        tk.Label(
            card,
            text=title,
            font=("Segoe UI", 14, "bold")
        ).pack(pady=8)

        tk.Button(
            card,
            text="فتح",
            command=lambda p=page: self.show_page(p)
        ).pack()
