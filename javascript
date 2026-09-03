function addProject() {
    let name = prompt("اسم المشروع");
    if (!name) return;

    let version = prompt("الإصدار", "1.0");
    let status = prompt("الحالة", "جديد");

    let email = prompt("mail للتواصل (اختياري)");
    let whatsapp = prompt("رابط واتساب (اختياري)");
    let facebook = prompt("رابط فيسبوك (اختياري)");
    let instagram = prompt("رابط إنستجرام (اختياري)");

    let card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
        <span class="status">🆕 ${status}</span>
        <img src="project.png" class="project-img">
        <h2>${name}</h2>
        <p><strong>الإصدار:</strong> ${version}</p>
        <p>تمت إضافته بواسطة أحد مستخدمي ASEM.</p>

        <div class="buttons">
            ${email ? `<a href="mailto:${email}">📧 إيميل</a>` : ""}
            ${whatsapp ? `<a href="${whatsapp}" target="_blank">💬 واتساب</a>` : ""}
            ${facebook ? `<a href="${facebook}" target="_blank">📘 فيسبوك</a>` : ""}
            ${instagram ? `<a href="${instagram}" target="_blank">📸 إنستجرام</a>` : ""}
        </div>
    `;

    document.getElementById("projectsGrid").prepend(card);
}
