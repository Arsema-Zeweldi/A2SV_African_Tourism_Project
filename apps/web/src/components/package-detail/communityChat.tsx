import React from 'react'
import { MessageCircle, Send } from 'lucide-react';
import { CommunityChats } from '@/app/package-details/data';

interface CommunityChatsProps {
    props: CommunityChats[];
}

const ChatBubble = ({
  user, time, msg, avatar, isHost,
}: {
  user: string; time: string; msg: string; avatar: string; isHost?: boolean;
}) => (
  <div className={`flex gap-2 ${isHost ? 'flex-row-reverse' : 'flex-row'}`}>
    <img src={avatar} alt={user} className="w-6 h-6 rounded-full object-cover shrink-0 mt-0.5" />
    <div className={`flex flex-col ${isHost ? 'items-end' : 'items-start'} max-w-[86%]`}>
      <div className={`flex items-center gap-1.5 mb-1 ${isHost ? 'flex-row-reverse' : ''}`}>
        <span className="text-[10px] font-bold text-slate-700">{user}</span>
        <span className="text-[9px] text-slate-400">{time}</span>
      </div>
      <div className={`px-3 py-2 rounded-xl text-[11px] leading-relaxed shadow-sm ${
        isHost
          ? 'bg-orange-50 border border-orange-100 text-slate-700 rounded-tr-[3px]'
          : 'bg-white border border-slate-100 text-slate-600 rounded-tl-[3px]'
      }`}>
        {msg}
      </div>
    </div>
  </div>
);

const CommunityChat = ({props}: CommunityChatsProps) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col h-[500px] overflow-hidden">
      <div className="px-4 py-3.5 border-b border-slate-100 flex justify-between items-center">
        <h3 className="text-[13px] font-bold text-slate-800 flex items-center gap-2">
          <MessageCircle size={15} className="text-[#F97316]" /> Community Chat
        </h3>
        <span className="bg-green-50 text-green-700 border border-green-100 text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" /> 12 Online
        </span>
      </div>
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 bg-[#F2EAE8]">
        {props.map((chat, index) => (
          <ChatBubble
            key={index}
            user={chat.name}
            time={chat.timeStamp}
            msg={chat.text}
            avatar={`https://i.pravatar.cc/150?u=${chat.name.split(' ').join('-')}`}
          />
        ))}
      </div>
      <div className="px-3 py-2.5 border-t border-slate-100 bg-white flex items-center gap-2">
        <input
          type="text"
          placeholder="Type a message..."
          className="flex-1 px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-xs focus:outline-none focus:ring-1 focus:ring-[#F97316] text-slate-700 placeholder:text-slate-400"
        />
        <button className="bg-primary hover:bg-orange-600 text-white w-8 h-8 rounded-lg flex items-center justify-center transition-colors">
          <Send size={13} />
        </button>
      </div>
    </div>
  )
}

export default CommunityChat