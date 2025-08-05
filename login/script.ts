import { login } from "../scripts/api.ts";

const loginButton = document.getElementById("login") as HTMLButtonElement;

const usernameInput = document.getElementById("username") as HTMLInputElement;
const passwordInput = document.getElementById("password") as HTMLInputElement;

loginButton.addEventListener("click", async (e) => {
	e.preventDefault();

	const data = {
		username: usernameInput.value,
		password: passwordInput.value,
	};

	const res = await login(data);
	console.log(res);
})
