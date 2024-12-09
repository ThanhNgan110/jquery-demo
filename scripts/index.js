$(document).ready(function () {
	// Retrieve students from localStorage
	let students = getStore();

	let editingIndex = null;

	updateTable();

	// Show popup to add a new student
	$("#add-new-btn").on("click", function () {
		resetForm();
		$("#popup").show();
		$(".popup-overlay").show();
	});

	// Hide popup
	$("#cancel-btn, .popup-overlay").on("click", function () {
		$("#popup").hide();
		$(".popup-overlay").hide();
	});

	// Save student information
	$("#student-form").on("submit", function (e) {
		e.preventDefault();

		const name = $("#name").val();
		const gender = $('input[name="gender"]:checked').val();
		const email = $("#email").val();
		const math = parseFloat($("#math").val());
		const physics = parseFloat($("#physics").val());
		const chemistry = parseFloat($("#chemistry").val());
		const average = ((math + physics + chemistry) / 3).toFixed(2);

		// Check if we're editing an existing student
		if (editingIndex !== null) {
			students[editingIndex] = {
				name,
				gender,
				email,
				math,
				physics,
				chemistry,
				average,
			};
			editingIndex = null;
		} else {
			const student = {
				id: Date.now(),
				name,
				gender,
				email,
				math,
				physics,
				chemistry,
				average,
			};
			console.log("stu", student);
			students.push(student);
		}

		setStore(students);

		// Update table and reset form
		updateTable();
		resetForm();
		$("#popup").hide();
		$(".popup-overlay").hide();
	});

	// Update the table with the current students data
	function updateTable() {
		const tbody = $("#student-table tbody");
		tbody.empty();

		let totalMath = 0,
			totalPhysics = 0,
			totalChemistry = 0;

		students.forEach((student, index) => {
			totalMath += student.math;
			totalPhysics += student.physics;
			totalChemistry += student.chemistry;

			tbody.append(`
		  <tr>
			<td><input type="checkbox" class="row-checkbox"></td>
			<td>${index + 1}</td>
			<td>${student.name}</td>
			<td>${student.gender}</td>
			<td>${student.email}</td>
			<td>${student.math}</td>
			<td>${student.physics}</td>
			<td>${student.chemistry}</td>
			<td>${student.average}</td>
			<td>
			  <button class="edit-btn" data-index="${index}">Edit</button>
			  <button class="delete-btn" data-index="${index}">Delete</button>
			</td>
		  </tr>
		`);
		});

		// Update averages
		$("#avg-math").text((totalMath / students.length || 0).toFixed(2));
		$("#avg-physics").text((totalPhysics / students.length || 0).toFixed(2));
		$("#avg-chemistry").text(
			(totalChemistry / students.length || 0).toFixed(2)
		);
		$("#avg-total").text(
			(
				(totalMath + totalPhysics + totalChemistry) / (students.length * 3) || 0
			).toFixed(2)
		);
	}

	// Handle student edit
	$(document).on("click", ".edit-btn", function () {
		editingIndex = $(this).data("index");
		const student = students[editingIndex];

		$("#name").val(student.name);
		$(`input[name="gender"][value="${student.gender}"]`).prop("checked", true);
		$("#email").val(student.email);
		$("#math").val(student.math);
		$("#physics").val(student.physics);
		$("#chemistry").val(student.chemistry);

		$("#popup").show();
		$(".popup-overlay").show();
	});

	// Handle student delete
	$(document).on("click", ".delete-btn", function () {
		if (confirm("Are you sure you want to delete?")) {
			const index = $(this).data("index");
			students.splice(index, 1);
			setStore(students);
			updateTable();
		}
	});

	// Handle "check all" functionality
	$("#check-all").on("change", function () {
		$(".row-checkbox").prop("checked", this.checked);
	});

	// Delete selected students
	$("#delete-selected-btn").on("click", function () {
		students = students.filter(
			(_, index) => !$(".row-checkbox:eq(" + index + ")").prop("checked")
		);
		setStore(students); // Save updated list
		updateTable(); // Refresh table
	});

	// Reset form inputs
	function resetForm() {
		$("#student-form")[0].reset();
		editingIndex = null;
	}
});

// Helper functions to manage localStorage
const getStore = () => {
	const data = localStorage.getItem("store");
	return data ? JSON.parse(data) : [];
};

const setStore = (data) => {
	localStorage.setItem("store", JSON.stringify(data));
};
