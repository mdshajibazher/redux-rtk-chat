import Message from "./Message";
import {useSelector} from "react-redux";

export default function Messages({messages = []}) {
    const {user} = useSelector(state =>  state.auth) || {};
    const {email} = user;
    console.log('messages',messages)
    return (
        <div className="relative w-full h-[calc(100vh_-_197px)] p-6 overflow-y-auto flex flex-col-reverse">
            <ul className="space-y-2">
                {
                        messages.slice().sort((x,y) => x.timestamp - y.timestamp).map((msg) => {
                        const {message: lastMessage,id,sender} = msg || {};
                        const justify = sender.email === email ? 'end' : 'start';
                        return <Message key={id} justify={justify} message={lastMessage} />
                        })

                }

            </ul>
        </div>
    );
}
