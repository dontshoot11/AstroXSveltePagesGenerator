import fs from "fs-extra";

export async function copyFileWithLog(source, destination) {
	try {
		const destinationExists = await fs.pathExists(destination);
		if (destinationExists) {
			const stat = await fs.stat(destination);
			if (stat.isDirectory()) {
				const files = await fs.readdir(destination);
				if (files.length > 0) {
					console.log(
						`Skipping copy: ${destination} already exists and is not empty.`
					);
					return;
				}
			}
		}

		await fs.copy(source, destination);
		console.log(`Successfully copied to ${destination}`);
	} catch (err) {
		console.error(`Error copying to ${destination}:`, err);
	}
}
