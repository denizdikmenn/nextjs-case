import { motion } from "framer-motion"

export const Loader = () => {

        console.log("dasdasdasd")

        return(
            <motion.div
                transition={{ repeat: Infinity, duration: 2 }}
                className="w-16 h-16"
                style={{backgroundColor: "#013565", marginLeft: "auto", marginRight: "auto"}}
                animate={{
                    scale: [1, 2, 2, 1, 1],
                    rotate: [0, 0, 270, 270, 0],
                    borderRadius: ["20%", "20%", "50%", "50%", "20%"],
                }}
            />
        )
    }