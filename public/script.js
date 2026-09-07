async function deleteTask(id) {
    const response = await fetch(`/delete/${id}`, {
        method: "DELETE"
    });

    const data = await response.json();

    // if (response.ok) {
    //     console.log(data.message);

    //     // UI se task remove karna
    // } else {
    //     console.log(data.message);
    // }

    if (data.success) {
        window.location.href = "/";
    }
}