import LPV2Future from "./components/left/LPV2Future"
import LPV2Last from "./components/left/LPV2Last"
import LPV2Services from "./components/left/LPV2Services"
import LPV2Head from "../components/components/left/LPV2Head"

const LPV2TopLeft = () => {

    return (
        <div className="lpv2-top-left">
            <LPV2Head />
            <LPV2Services />
            <LPV2Last />
            <LPV2Future />
        </div>
    )
}

export default LPV2TopLeft