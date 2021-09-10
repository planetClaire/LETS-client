import { gql } from '@apollo/client';

const LOCALITY_ATTRIBUTES = gql`
	fragment LocalityInfo on Locality {
		uid
		name
		postcode
	}
`;

const MEMBER_ATTRIBUTES = gql`
	fragment MemberInfo on Member {
		id
		firstName
		lastName
		phone
		localityId
		streetAddress
		approved
	}
`;

export const GET_LOCALITIES = gql`
	query GetLocalities {
		localities {
			...LocalityInfo
		}
	}
	${LOCALITY_ATTRIBUTES}
`;

export const ADD_LOCALITY = gql`
	mutation addLocality($locality: LocalityInput!) {
		addLocality(input: $locality) {
			locality {
				...LocalityInfo
			}
			userErrors {
				message
			}
		}
	}
	${LOCALITY_ATTRIBUTES}
`;

export const UPDATE_LOCALITY = gql`
	mutation updateLocality($locality: LocalityInput!) {
		updateLocality(input: $locality) {
			locality {
				...LocalityInfo
			}
			userErrors {
				message
			}
		}
	}
	${LOCALITY_ATTRIBUTES}
`;

export const DELETE_LOCALITY = gql`
	mutation deleteLocality($id: UUID!) {
		deleteLocality(id: $id) {
			locality {
				...LocalityInfo
			}
			userErrors {
				message
			}
		}
	}
	${LOCALITY_ATTRIBUTES}
`;

export const GET_MEMBER = gql`
	query GetMember($id: ID!) {
		member(id: $id) {
			...MemberInfo
		}
	}
	${MEMBER_ATTRIBUTES}
`;

export const GET_MEMBERS = gql`
	query GetMembers {
		members {
			...MemberInfo
		}
	}
	${MEMBER_ATTRIBUTES}
`;

export const ADD_MEMBER = gql`
	mutation addMember($member: AddMemberInput!) {
		addMember(input: $member) {
			member {
				...MemberInfo
			}
			userErrors {
				message
			}
		}
	}
	${MEMBER_ATTRIBUTES}
`;
