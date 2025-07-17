import DoctorUpdate from "../components/DoctorUpdate"

type TParams = {
	params: {
		doctorId: string
	}
}

const DoctorUpdatePage = async ({ params }: TParams) => {
	const { doctorId } = await params

	return <DoctorUpdate doctorId={doctorId} />
}

export default DoctorUpdatePage
