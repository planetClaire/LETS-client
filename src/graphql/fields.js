import { gql } from '@apollo/client';

const GET_LOCALITIES = gql`
	query GetLocalities {
		localities {
			name
			postcode
		}
	}
`;

export const GET_MEMBER = gql`
	query GetMember($id: ID!) {
		member(id: $id) {
			approved
			firstName
			lastName
		}
	}
`;
