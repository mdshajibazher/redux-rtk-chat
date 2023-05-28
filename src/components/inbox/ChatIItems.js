import ChatItem from "./ChatItem";
import {useGetConversationsQuery} from "../../features/conversations/conversationsApi";
import {useSelector} from "react-redux";
import Error from "../ui/Error";
import moment from "moment";
import getPartnerInfo from "../../utils/getPartnerInfo";
import gravatarUrl from "gravatar-url";
export default function ChatItems() {
    const {user} = useSelector(state => state.auth) || {};
    const {email} = user || {};
    const {data: conversations, isLoading, isError, error} = useGetConversationsQuery(email);

    let content = null;

    if(isLoading){
        content = <li className="m-2 text-center">Loading...</li>
    }else if(!isLoading && isError){
        content = <li className="m-2 text-center">
            <Error message={error.data}/>
        </li>
    }else if(!isLoading && !isError && conversations?.length === 0){
        content = <li className="m-2 text-center">No conversations found :)</li>
    }else if(!isLoading && !isError && conversations?.length > 0){
        content = conversations.map((conversation,index) => {
            const {id, message, timestamp} = conversation;
            const partner = getPartnerInfo(conversation.users, email)
            return   <li key={conversation?.id ? conversation?.id : 'a'+index} className="m-2 text-center">
                <ChatItem
                avatar={gravatarUrl(partner.email)}
                name={partner.name}
                lastMessage={message}
                lastTime={moment(timestamp).fromNow()}
                id={conversation?.id}
            />
                </li>
        })
    }

    return (
        <ul>
            {content}
        </ul>
    );
}
