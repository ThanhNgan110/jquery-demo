export const getStore = () => {
	const data = localStorage.getItem("store");
	return data ? JSON.parse(data) : [];
};

export const setStore = (data) => {
	localStorage.setItem("store", JSON.stringify(data));
};
