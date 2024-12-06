$(document).ready(function () {
	let students = [];
	let editingIndex = null;

	// Hiển thị popup
	$("#add-new-btn").on("click", function () {
		resetForm();
		$("#popup").show();
		$(".popup-overlay").show();
	});

	// Ẩn popup
	$("#cancel-btn, .popup-overlay").on("click", function () {
		$("#popup").hide();
		$(".popup-overlay").hide();
	});

	// Lưu thông tin học sinh
	$("#student-form").on("submit", function (e) {
		e.preventDefault();

		const name = $("#name").val();
		const gender = $('input[name="gender"]:checked').val();
		const email = $("#email").val();
		const math = parseFloat($("#math").val());
		const physics = parseFloat($("#physics").val());
		const chemistry = parseFloat($("#chemistry").val());
		const average = ((math + physics + chemistry) / 3).toFixed(2);

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
			students.push({ name, gender, email, math, physics, chemistry, average });
		}

		updateTable();
		resetForm();
		$("#popup").hide();
		$(".popup-overlay").hide();
	});

	// Cập nhật bảng
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
            <button class="edit-btn" data-index="${index}">Chỉnh sửa</button>
            <button class="delete-btn" data-index="${index}">Xoá</button>
          </td>
        </tr>
      `);
		});

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

	// Xử lý chỉnh sửa
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

	// Xóa học sinh
	$(document).on("click", ".delete-btn", function () {
		if (confirm("Bạn có chắc chắn muốn xoá?")) {
			const index = $(this).data("index");
			students.splice(index, 1);
			updateTable();
		}
	});

	// Check all
	$("#check-all").on("change", function () {
		$(".row-checkbox").prop("checked", this.checked);
	});

	// Xóa nhiều dòng
	$("#delete-selected-btn").on("click", function () {
		students = students.filter(
			(_, index) => !$(`.row-checkbox:eq(${index})`).prop("checked")
		);
		updateTable();
	});

	// Reset form
	function resetForm() {
		$("#student-form")[0].reset();
		editingIndex = null;
	}
});
