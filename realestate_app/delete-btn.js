// deleteProperty.js
document.addEventListener('DOMContentLoaded', () => {
  // Add click event listener to delete buttons
  const deleteButtons = document.querySelectorAll('.delete-btn');

  deleteButtons.forEach(button => {
    button.addEventListener('click', async (event) => {
      const row = event.target.closest('tr'); // Get the closest row
      const propertyId = row.querySelector('td').textContent.trim(); // Get the property ID

      if (confirm('Are you sure you want to delete this property?')) {
        try {
          console.log(`Attempting to delete property with ID: ${propertyId}`);
          const response = await fetch(`/properties/delete/${propertyId}`, {
            method: 'DELETE',
          });

          if (response.ok) {
            row.remove(); // Remove the row from the table
            alert('Property deleted successfully');
            console.log(`Property with ID ${propertyId} deleted successfully`);
          } else {
            const errorMsg = await response.json();
            console.error(`Failed to delete property: ${errorMsg.error}`);
            alert(`Failed to delete property: ${errorMsg.error}`);
          }
        } catch (err) {
          console.error('Error:', err);
          alert('An error occurred while deleting the property');
        }
      }
    });
  });
});
