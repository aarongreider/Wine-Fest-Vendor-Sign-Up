import { Icon_Warning } from "./Icons"
import { Edit } from "./types"

interface Props {
    dirtyCount: number
    changeLog: Map<string, Edit>
}

export default function WarningWidget({ dirtyCount, changeLog }: Props) {
    return <>{dirtyCount > 0 || changeLog.size > 0
        ? <div className='flex row card' style={{ background: '#c04444', color: 'white', fontWeight: 'bold', fontFamily: 'sans-serif', /* background: 'none', */ /* outline: "3px solid red", */ padding: "5px 10px 5px 7px" }}>
            {/* <img style={{ height: '30px' }} src="https://static.vecteezy.com/system/resources/previews/017/172/388/original/warning-message-concept-represented-by-exclamation-mark-icon-exclamation-symbol-in-circle-png.png" /> */}
            <Icon_Warning/>
            <p style={{ textWrap: 'nowrap' }}>You have unsaved changes</p>
        </div>
        : undefined
    }</>
}