import { register, type Role } from "../scripts/auth.ts";

const registerButton = document.getElementById("register") as HTMLButtonElement;

const usernameInput = document.getElementById("username") as HTMLInputElement;
const passwordInput = document.getElementById("password") as HTMLInputElement;
const roleSelect = document.getElementById("role") as HTMLSelectElement;

registerButton.addEventListener("click", async (e) => {
	e.preventDefault();

	const data = {
		username: usernameInput.value,
		password: passwordInput.value,
		role: roleSelect.value as Role
	};

	const res = await register(data);
	console.log(res);
})
