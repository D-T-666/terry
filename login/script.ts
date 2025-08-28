import { login } from "../scripts/auth.ts";

const loginButton = document.getElementById("login") as HTMLButtonElement;

const usernameInput = document.getElementById("email") as HTMLInputElement;
const passwordInput = document.getElementById("password") as HTMLInputElement;
const rememberInput = document.getElementById("remember-me") as HTMLInputElement;

loginButton.addEventListener("click", async (e) => {
	e.preventDefault();

	const data = {
		username: usernameInput.value,
		password: passwordInput.value,
		remember: rememberInput.checked
	};

	try {
		await login(data);
		window.location.href = "/browse/";
	} catch (e) {
		alert("ავთენტიკაცია ვერ შესრულდა. სცადე ელ. ფოსტისა ან პაროლის ხელახლა ჩაწერა.");
	}
})
