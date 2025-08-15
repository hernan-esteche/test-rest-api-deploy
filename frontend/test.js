fetch('https://my-backend.onrender.com/movies')
	.then((response) => response.json())
	.then((data) => {
		console.log(data);
		data.forEach((movie) => {
			const movieElement = document.createElement('div');
			movieElement.innerHTML = `<p style="font-weight: bold; text-align: center">${movie.title}</p>
			 <img style="max-width: 100%; height: auto;" src="${movie.poster}" alt="${movie.title} poster" /> 
			 <p style="font-style: italic; text-align: center; font-weight: semi-bold;">(${movie.year})</p>
			 <button style="display: block; margin: 0 auto;" data-id="${movie.id}">Delete</button>
			 `;
			const deleteButton = movieElement.querySelector('button');

			deleteButton.addEventListener('click', () => {
				const id = deleteButton.dataset.id;
				fetch(`http://localhost:3000/movies/${id}`, {
					method: 'DELETE',
				})
					.then((response) => {
						if (response.ok) {
							movieElement.remove();
						} else {
							console.error('Error deleting movie:', response.statusText);
						}
					})
					.catch((error) => console.error('Error deleting movie:', error));
			});

			document.body.appendChild(movieElement);
		});
	})
	.catch((error) => console.error('Error fetching movies:', error));
