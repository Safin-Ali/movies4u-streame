const player_page = (url) => {
	return `
	<!DOCTYPE html>
	<html lang="en">
	<head>
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<title>MVOIES4U Player</title>
		<link rel="stylesheet" href="https://cdn.plyr.io/3.7.8/plyr.css" />
	</head>

	<body>
		<video id="player" playsinline controls>
			<source src="${url}" type="video/mp4" />

		  </video>

		  <script src="https://cdn.plyr.io/3.7.8/plyr.polyfilled.js"></script>
		  <script>
			const player = new Plyr('#player');
		  </script>
	</body>
	</html>
	`;
};

export default player_page;