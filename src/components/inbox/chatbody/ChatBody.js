// import Blank from "./Blank";
import ChatHead from "./ChatHead";
import Messages from "./Messages";
import Options from "./Options";
import {useGetMessagesQuery} from "../../../features/messages/messagesApi";
import {useParams} from "react-router-dom";
import Error from "../../ui/Error";

export default function ChatBody() {
    const {id} = useParams()
    const {data: messages, isLoading, isError,error} = useGetMessagesQuery(id);

    let content = null;
    if(isLoading){
        content =  <div>Loading...</div>
    }else if(!isLoading && isError){
        content = <div><Error message={error?.data} /> </div>
    }else if(!isLoading && !isError && messages?.length === 0){
        content =  <div>No Messages Found...</div>
    }else if(!isLoading && !isError && messages?.length > 0){
        console.log('messages p',messages)
        content =  <>
            <ChatHead
               messages={messages[0]}
            />
            <Messages messages={messages} />
            <Options />
        </>
    }

    return (
        <div className="w-full lg:col-span-2 lg:block">
            <div className="w-full grid conversation-row-grid">
                {content}
            </div>
        </div>
    );
}
