export const formatErrors = (errors) => {
	return errors.map((e) => e.message).join('\n');
};
