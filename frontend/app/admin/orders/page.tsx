"use client";

import { useState, useEffect, useCallback } from "react";
import api from "@/lib/api";

type Order = {
  _id: string;
  orderNumber: string;
  buyer: { name: string; phone: string; email?: string; address?: { city?: string; state?: string } };
  items: { name: string; quantity: number; price: number; total: number }[];
  subtotal: number;
  taxAmount: number;
  total: number;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  notes?: string;
  statusHistory?: { status: string; note: string; changedAt: string }[];
  createdAt: string;
  sellerId?: { name: string; email: string };
};

const statusStyle = (s: string) => ({
  PENDING:    { bg:"#FFFBEB", color:"#854d0e",  border:"#FDE68A",  dot:"#f59e0b" },
  CONFIRMED:  { bg:"#EFF6FF", color:"#1d4ed8",  border:"#BFDBFE",  dot:"#3b82f6" },
  PROCESSING: { bg:"#F5F3FF", color:"#6d28d9",  border:"#DDD6FE",  dot:"#8b5cf6" },
  SHIPPED:    { bg:"#ECFDF5", color:"#065f46",  border:"#A7F3D0",  dot:"#10b981" },
  DELIVERED:  { bg:"#F0FDF4", color:"#15803d",  border:"#BBF7D0",  dot:"#22c55e" },
  CANCELLED:  { bg:"#FEF2F2", color:"#dc2626",  border:"#FECACA",  dot:"#ef4444" },
}[s] || { bg:"#F5E6C8", color:"#6B4F12", border:"#E8D5A3", dot:"#C9A84C" });

function Toast({ msg, type, onClose }: { msg:string; type:"success"|"error"; onClose:()=>void }) {
  useEffect(()=>{ const t=setTimeout(onClose,4000); return ()=>clearTimeout(t); },[]);
  const c = type==="success"
    ? {bg:"#F0FDF4",border:"#BBF7D0",color:"#15803d",icon:"✅"}
    : {bg:"#FEF2F2",border:"#FECACA",color:"#dc2626",icon:"❌"};
  return (
    <div style={{position:"fixed",top:"24px",right:"24px",zIndex:9999,padding:"12px 16px",borderRadius:"12px",background:c.bg,border:`1px solid ${c.border}`,color:c.color,fontSize:"13px",fontWeight:500,boxShadow:"0 6px 24px rgba(0,0,0,.1)",display:"flex",alignItems:"center",gap:"10px",maxWidth:"360px",animation:"slideDown .3s ease",fontFamily:"inherit"}}>
      <span>{c.icon}</span><span style={{flex:1,lineHeight:1.5}}>{msg}</span>
      <button onClick={onClose} style={{background:"none",border:"none",cursor:"pointer",fontSize:"17px",color:"inherit",padding:0,opacity:.6}}>×</button>
    </div>
  );
}

function SkeletonRow() {
  return (
    <div style={{display:"grid",gridTemplateColumns:"150px 1fr 100px 90px 110px 100px 80px",padding:"14px 20px",borderBottom:"1px solid #F5EDE0",alignItems:"center"}}>
      {[110,140,70,60,80,70,60].map((w,i)=>(<div key={i} className="skeleton" style={{width:`${w}px`,height:"13px",borderRadius:"4px"}}/>))}
    </div>
  );
}

function OrderDrawer({ order, onClose, onStatusUpdate }: { order:Order; onClose:()=>void; onStatusUpdate:(id:string,status:string)=>Promise<void> }) {
  const [updating, setUpdating] = useState(false);
  const STATUS_FLOW = ["PENDING","CONFIRMED","PROCESSING","SHIPPED","DELIVERED"];
  const currentIdx  = STATUS_FLOW.indexOf(order.status);
  const sc = statusStyle(order.status);

  const handleStatus = async (status:string) => {
    setUpdating(true);
    await onStatusUpdate(order._id, status);
    setUpdating(false);
  };

  return (
    <div style={{position:"fixed",inset:0,zIndex:1000}}>
      <div style={{position:"absolute",inset:0,background:"rgba(44,24,16,.5)",backdropFilter:"blur(3px)"}} onClick={onClose}/>
      <div style={{position:"absolute",right:0,top:0,bottom:0,width:"460px",background:"#FFFDF9",boxShadow:"-8px 0 48px rgba(44,24,16,.2)",overflowY:"auto",animation:"slideLeft .3s ease",display:"flex",flexDirection:"column"}}>
        <div style={{background:"linear-gradient(135deg,#1A0F0A,#2C1810,#3D2B1F)",padding:"22px 24px",flexShrink:0}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
            <div>
              <div style={{fontSize:"20px",fontFamily:"Georgia,serif",color:"#C9A84C",fontWeight:400}}>{order.orderNumber}</div>
              <div style={{fontSize:"12px",color:"rgba(245,230,200,.5)",marginTop:"3px"}}>{new Date(order.createdAt).toLocaleDateString("en-IN",{day:"numeric",month:"long",year:"numeric"})}</div>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:"10px"}}>
              <span style={{padding:"4px 10px",borderRadius:"99px",fontSize:"11px",fontWeight:700,background:sc.bg,color:sc.color,border:`1px solid ${sc.border}`}}>{order.status}</span>
              <button onClick={onClose} style={{width:"30px",height:"30px",borderRadius:"50%",background:"rgba(255,255,255,.08)",border:"none",color:"#C9A84C",fontSize:"16px",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"inherit"}}>×</button>
            </div>
          </div>
        </div>
        <div style={{padding:"20px 24px",flex:1,display:"flex",flexDirection:"column",gap:"18px"}}>
          {/* Buyer */}
          <div>
            <p style={{fontSize:"10px",fontWeight:700,color:"#A08060",textTransform:"uppercase",letterSpacing:".08em",marginBottom:"8px"}}>Buyer</p>
            <div style={{background:"#FBF7F0",borderRadius:"10px",padding:"13px",border:"1px solid #E8D5A3"}}>
              <div style={{fontSize:"14px",fontWeight:600,color:"#2C1810"}}>{order.buyer?.name}</div>
              <div style={{fontSize:"13px",color:"#6B4F12",marginTop:"2px"}}>{order.buyer?.phone}</div>
              {order.buyer?.email&&<div style={{fontSize:"12px",color:"#A08060",marginTop:"2px"}}>{order.buyer.email}</div>}
              {order.buyer?.address?.city&&<div style={{fontSize:"12px",color:"#A08060",marginTop:"3px"}}>📍 {[order.buyer.address.city,order.buyer.address.state].filter(Boolean).join(", ")}</div>}
            </div>
          </div>
          {/* Items */}
          <div>
            <p style={{fontSize:"10px",fontWeight:700,color:"#A08060",textTransform:"uppercase",letterSpacing:".08em",marginBottom:"8px"}}>Items</p>
            {order.items?.map((item,i)=>(
              <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"9px 13px",background:i%2===0?"#FBF7F0":"#FFFDF9",borderRadius:"7px",marginBottom:"5px",border:"1px solid #F0E4C0"}}>
                <div>
                  <div style={{fontSize:"13px",fontWeight:500,color:"#2C1810"}}>{item.name}</div>
                  <div style={{fontSize:"12px",color:"#A08060"}}>Qty {item.quantity} × ₹{item.price?.toLocaleString("en-IN")}</div>
                </div>
                <div style={{fontWeight:700,color:"#2C1810",fontFamily:"Georgia,serif"}}>₹{item.total?.toLocaleString("en-IN")}</div>
              </div>
            ))}
          </div>
          {/* Totals */}
          <div style={{background:"#FBF7F0",borderRadius:"10px",padding:"13px",border:"1px solid #E8D5A3"}}>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:"13px",color:"#6B4F12",marginBottom:"5px"}}><span>Subtotal</span><span>₹{order.subtotal?.toLocaleString("en-IN")}</span></div>
            {order.taxAmount>0&&<div style={{display:"flex",justifyContent:"space-between",fontSize:"13px",color:"#6B4F12",marginBottom:"5px"}}><span>Tax</span><span>₹{order.taxAmount?.toLocaleString("en-IN")}</span></div>}
            <div style={{display:"flex",justifyContent:"space-between",fontSize:"16px",fontWeight:700,borderTop:"1px solid #E8D5A3",paddingTop:"8px",marginTop:"5px"}}>
              <span style={{color:"#2C1810"}}>Total</span>
              <span style={{color:"#8B6914",fontFamily:"Georgia,serif"}}>₹{order.total?.toLocaleString("en-IN")}</span>
            </div>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:"12px",color:"#A08060",marginTop:"6px"}}>
              <span>Payment: <strong style={{color:"#6B4F12"}}>{order.paymentMethod}</strong></span>
              <span style={{padding:"2px 7px",borderRadius:"99px",background:order.paymentStatus==="PAID"?"#F0FDF4":"#FFFBEB",color:order.paymentStatus==="PAID"?"#15803d":"#854d0e",fontSize:"11px",fontWeight:700,border:`1px solid ${order.paymentStatus==="PAID"?"#BBF7D0":"#FDE68A"}`}}>{order.paymentStatus}</span>
            </div>
          </div>
          {/* Status update */}
          <div>
            <p style={{fontSize:"10px",fontWeight:700,color:"#A08060",textTransform:"uppercase",letterSpacing:".08em",marginBottom:"10px"}}>Update Status</p>
            <div style={{display:"flex",gap:"6px",flexWrap:"wrap"}}>
              {STATUS_FLOW.map(s=>{
                const sIdx=STATUS_FLOW.indexOf(s);
                const isPast=sIdx<currentIdx, isCurrent=s===order.status;
                const ss2=statusStyle(s);
                return (
                  <button key={s} disabled={isPast||isCurrent||updating} onClick={()=>handleStatus(s)} style={{padding:"6px 12px",borderRadius:"99px",fontSize:"11px",fontWeight:600,border:`1px solid ${isCurrent?ss2.border:"#E8D5A3"}`,background:isCurrent?ss2.bg:isPast?"#F5EDE0":"transparent",color:isCurrent?ss2.color:isPast?"#C4A882":"#6B4F12",cursor:isPast||isCurrent?"default":"pointer",transition:"all .15s",opacity:updating?.6:1}}>
                    {isCurrent&&"✓ "}{s}
                  </button>
                );
              })}
              <button disabled={order.status==="CANCELLED"||updating} onClick={()=>handleStatus("CANCELLED")} style={{padding:"6px 12px",borderRadius:"99px",fontSize:"11px",fontWeight:600,border:"1px solid #FECACA",background:order.status==="CANCELLED"?"#FEF2F2":"transparent",color:"#dc2626",cursor:order.status==="CANCELLED"?"default":"pointer"}}>
                {order.status==="CANCELLED"&&"✓ "}CANCEL
              </button>
            </div>
          </div>
          {/* Timeline */}
          {(order.statusHistory?.length||0)>0&&(
            <div>
              <p style={{fontSize:"10px",fontWeight:700,color:"#A08060",textTransform:"uppercase",letterSpacing:".08em",marginBottom:"10px"}}>Activity Timeline</p>
              <div style={{position:"relative",paddingLeft:"20px"}}>
                <div style={{position:"absolute",left:"6px",top:0,bottom:0,width:"1px",background:"#E8D5A3"}}/>
                {[...(order.statusHistory||[])].reverse().slice(0,5).map((h,i)=>{
                  const hs=statusStyle(h.status);
                  return (
                    <div key={i} style={{marginBottom:"12px",position:"relative"}}>
                      <div style={{width:"12px",height:"12px",borderRadius:"50%",background:hs.dot,position:"absolute",left:"-17px",top:"2px",border:"2px solid #FFFDF9"}}/>
                      <div style={{fontSize:"12px",fontWeight:600,color:hs.color}}>{h.status}</div>
                      <div style={{fontSize:"11px",color:"#A08060",lineHeight:1.4}}>{h.note}</div>
                      <div style={{fontSize:"10px",color:"#C4A882",marginTop:"2px"}}>{new Date(h.changedAt).toLocaleDateString("en-IN",{day:"numeric",month:"short",hour:"2-digit",minute:"2-digit"})}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AdminOrdersPage() {
  const [orders, setOrders]           = useState<Order[]>([]);
  const [stats, setStats]             = useState<any[]>([]);
  const [loading, setLoading]         = useState(true);
  const [tableLoading, setTableLoading] = useState(false);
  const [page, setPage]               = useState(1);
  const [totalPages, setTotalPages]   = useState(1);
  const [total, setTotal]             = useState(0);
  const [search, setSearch]           = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order|null>(null);
  const [toast, setToast]             = useState<{msg:string;type:"success"|"error"}|null>(null);

  const showToast = (msg:string,type:"success"|"error"="success")=>setToast({msg,type});

  const fetchOrders = useCallback(async(p=1,s="",sf="",smooth=false)=>{
    smooth?setTableLoading(true):setLoading(true);
    try {
      const params=new URLSearchParams({page:String(p),limit:"10"});
      if(s) params.append("search",s);
      if(sf) params.append("status",sf);
      const res=await api.get(`/orders?${params}`);
      setOrders(res.data.orders);
      setStats(res.data.stats||[]);
      setTotalPages(res.data.pagination.totalPages);
      setTotal(res.data.pagination.total);
      setPage(p);
    }catch(e){console.error(e);}
    finally{smooth?setTableLoading(false):setLoading(false);}
  },[]);

  useEffect(()=>{fetchOrders(1,"","");},[fetchOrders]);

  const handleStatusUpdate=async(orderId:string,status:string)=>{
    try{
      await api.patch(`/orders/${orderId}/status`,{status,note:`Status updated to ${status} by admin`});
      showToast(`Order updated to ${status}`);
      setSelectedOrder((prev:any)=>prev?{...prev,status}:null);
      fetchOrders(page,search,statusFilter,true);
    }catch(e:any){showToast(e.response?.data?.message||"Update failed","error");}
  };

  const totalRevenue=stats.filter(s=>s._id!=="CANCELLED").reduce((sum,s)=>sum+s.revenue,0);

  return (
    <div style={{maxWidth:"1100px"}}>
      {toast&&<Toast msg={toast.msg} type={toast.type} onClose={()=>setToast(null)}/>}
      {selectedOrder&&<OrderDrawer order={selectedOrder} onClose={()=>setSelectedOrder(null)} onStatusUpdate={handleStatusUpdate}/>}

      <div style={{marginBottom:"24px"}}>
        <p style={{fontSize:"12px",color:"#A08060",letterSpacing:".1em",textTransform:"uppercase",marginBottom:"4px"}}>Admin</p>
        <h1 style={{fontSize:"26px",fontFamily:"Georgia,serif",color:"#2C1810",fontWeight:400}}>All Orders</h1>
        <p style={{fontSize:"14px",color:"#A08060",marginTop:"3px"}}>{total} total orders across all sellers</p>
      </div>

      {/* Stats */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:"12px",marginBottom:"20px"}}>
        {loading?Array(5).fill(0).map((_,i)=><div key={i} className="skeleton" style={{height:"90px",borderRadius:"12px"}}/>):(
          <>
            <div style={{background:"linear-gradient(135deg,#2C1810,#3D2B1F)",borderRadius:"14px",padding:"16px 18px"}}>
              <div style={{fontSize:"10px",color:"rgba(201,168,76,.55)",letterSpacing:".08em",marginBottom:"8px"}}>REVENUE</div>
              <div style={{fontSize:"20px",fontWeight:700,color:"#C9A84C",fontFamily:"Georgia,serif"}}>₹{totalRevenue.toLocaleString("en-IN")}</div>
              <div style={{fontSize:"11px",color:"rgba(245,230,200,.4)",marginTop:"3px"}}>All time</div>
            </div>
            {[{s:"PENDING",icon:"⏳"},{s:"CONFIRMED",icon:"✅"},{s:"SHIPPED",icon:"🚚"},{s:"DELIVERED",icon:"📬"}].map(({s,icon})=>{
              const sc2=statusStyle(s);
              const count=stats.find(x=>x._id===s)?.count||0;
              return (
                <div key={s} onClick={()=>{setStatusFilter(statusFilter===s?"":s);fetchOrders(1,search,statusFilter===s?"":s,true);}} style={{background:"#FFFDF9",border:`1px solid ${statusFilter===s?sc2.border:"#E8D5A3"}`,borderRadius:"14px",padding:"16px 18px",cursor:"pointer",transition:"all .2s"}}>
                  <div style={{fontSize:"18px",marginBottom:"6px"}}>{icon}</div>
                  <div style={{fontSize:"20px",fontWeight:700,color:sc2.color,fontFamily:"Georgia,serif"}}>{count}</div>
                  <div style={{fontSize:"11px",color:"#A08060",marginTop:"3px"}}>{s}</div>
                </div>
              );
            })}
          </>
        )}
      </div>

      {/* Search + filter */}
      <div style={{display:"flex",gap:"10px",marginBottom:"16px",flexWrap:"wrap"}}>
        <div style={{flex:1,minWidth:"200px",position:"relative"}}>
          <span style={{position:"absolute",left:"13px",top:"50%",transform:"translateY(-50%)",fontSize:"14px",pointerEvents:"none"}}>🔍</span>
          <input value={search} onChange={e=>setSearch(e.target.value)} onKeyDown={e=>e.key==="Enter"&&fetchOrders(1,search,statusFilter,true)} placeholder="Search by order no., buyer name, phone..." style={{width:"100%",padding:"10px 14px 10px 36px",borderRadius:"9px",border:"1.5px solid #E8D5A3",fontSize:"13px",color:"#2C1810",background:"#FFFDF9",outline:"none",fontFamily:"inherit"}}/>
        </div>
        <select value={statusFilter} onChange={e=>{setStatusFilter(e.target.value);fetchOrders(1,search,e.target.value,true);}} style={{padding:"10px 14px",borderRadius:"9px",border:"1.5px solid #E8D5A3",fontSize:"13px",color:"#2C1810",background:"#FFFDF9",outline:"none",cursor:"pointer",fontFamily:"inherit"}}>
          <option value="">All Status</option>
          {["PENDING","CONFIRMED","PROCESSING","SHIPPED","DELIVERED","CANCELLED"].map(s=><option key={s}>{s}</option>)}
        </select>
        <button onClick={()=>fetchOrders(1,search,statusFilter,true)} style={{padding:"10px 20px",borderRadius:"9px",background:"#2C1810",color:"#C9A84C",border:"none",fontSize:"13px",fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>Search</button>
        {(search||statusFilter)&&<button onClick={()=>{setSearch("");setStatusFilter("");fetchOrders(1,"","",true);}} style={{padding:"10px 16px",borderRadius:"9px",border:"1px solid #E8D5A3",background:"transparent",color:"#A08060",fontSize:"13px",cursor:"pointer",fontFamily:"inherit"}}>Clear</button>}
      </div>

      {/* Table */}
      <div style={{background:"#FFFDF9",border:"1px solid #E8D5A3",borderRadius:"16px",overflow:"hidden",opacity:tableLoading?.6:1,transition:"opacity .25s"}}>
        <div style={{display:"grid",gridTemplateColumns:"150px 1fr 100px 90px 110px 100px 80px",padding:"10px 20px",background:"linear-gradient(135deg,#2C1810,#3D2B1F)"}}>
          {["Order #","Buyer","Items","Total","Status","Date",""].map(h=>(
            <div key={h} style={{fontSize:"10px",fontWeight:700,color:"#C9A84C",letterSpacing:".08em",textTransform:"uppercase"}}>{h}</div>
          ))}
        </div>
        {loading?Array(5).fill(0).map((_,i)=><SkeletonRow key={i}/>)
        :orders.length===0?(
          <div style={{padding:"64px 20px",textAlign:"center"}}>
            <div style={{fontSize:"48px",marginBottom:"14px"}}>📦</div>
            <p style={{fontSize:"17px",fontWeight:500,color:"#2C1810",marginBottom:"6px"}}>No orders found</p>
            <p style={{fontSize:"13px",color:"#A08060"}}>{search||statusFilter?"Try different filters":"No orders yet"}</p>
          </div>
        ):(
          <>
            {orders.map((o,i)=>{
              const sc2=statusStyle(o.status);
              return (
                <div key={o._id} onClick={()=>setSelectedOrder(o)} style={{display:"grid",gridTemplateColumns:"150px 1fr 100px 90px 110px 100px 80px",padding:"14px 20px",borderBottom:i<orders.length-1?"1px solid #F5EDE0":"none",background:i%2===0?"#FFFDF9":"#FDFAF4",alignItems:"center",cursor:"pointer",transition:"background .15s"}}
                  onMouseEnter={e=>(e.currentTarget as HTMLElement).style.background="#F5E6C8"}
                  onMouseLeave={e=>(e.currentTarget as HTMLElement).style.background=i%2===0?"#FFFDF9":"#FDFAF4"}
                >
                  <div>
                    <div style={{fontSize:"13px",fontWeight:600,color:"#2C1810"}}>{o.orderNumber}</div>
                    <div style={{fontSize:"11px",color:"#A08060"}}>{new Date(o.createdAt).toLocaleDateString("en-IN",{day:"numeric",month:"short"})}</div>
                  </div>
                  <div>
                    <div style={{fontSize:"13px",fontWeight:500,color:"#2C1810"}}>{o.buyer?.name}</div>
                    <div style={{fontSize:"11px",color:"#A08060"}}>{o.buyer?.phone}</div>
                  </div>
                  <div style={{fontSize:"12px",color:"#6B4F12"}}>{o.items?.length} item{o.items?.length>1?"s":""}</div>
                  <div style={{fontSize:"13px",fontWeight:700,color:"#2C1810",fontFamily:"Georgia,serif"}}>₹{o.total?.toLocaleString("en-IN")}</div>
                  <span style={{display:"inline-flex",alignItems:"center",gap:"4px",padding:"3px 8px",borderRadius:"99px",fontSize:"10px",fontWeight:700,background:sc2.bg,color:sc2.color,border:`1px solid ${sc2.border}`}}>
                    <span style={{width:"5px",height:"5px",borderRadius:"50%",background:sc2.dot}}/>
                    {o.status}
                  </span>
                  <div style={{fontSize:"11px",color:"#A08060"}}>{new Date(o.createdAt).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"2-digit"})}</div>
                  <div style={{fontSize:"12px",color:"#8B6914",fontWeight:600}}>View →</div>
                </div>
              );
            })}
            {totalPages>1&&(
              <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:"6px",padding:"14px",borderTop:"1px solid #F0E4C0"}}>
                <button onClick={()=>fetchOrders(1,search,statusFilter,true)} disabled={page===1} style={{padding:"5px 10px",borderRadius:"6px",border:"1px solid #E8D5A3",background:"transparent",color:page===1?"#C4A882":"#6B4F12",cursor:page===1?"not-allowed":"pointer",fontSize:"12px",fontFamily:"inherit"}}>«</button>
                <button onClick={()=>fetchOrders(page-1,search,statusFilter,true)} disabled={page===1} style={{padding:"5px 13px",borderRadius:"6px",border:"1px solid #E8D5A3",background:"transparent",color:page===1?"#C4A882":"#2C1810",cursor:page===1?"not-allowed":"pointer",fontSize:"13px",fontFamily:"inherit"}}>← Prev</button>
                <span style={{fontSize:"13px",color:"#A08060",padding:"0 8px"}}>Page {page} of {totalPages}</span>
                <button onClick={()=>fetchOrders(page+1,search,statusFilter,true)} disabled={page===totalPages} style={{padding:"5px 13px",borderRadius:"6px",border:"1px solid #E8D5A3",background:"transparent",color:page===totalPages?"#C4A882":"#2C1810",cursor:page===totalPages?"not-allowed":"pointer",fontSize:"13px",fontFamily:"inherit"}}>Next →</button>
                <button onClick={()=>fetchOrders(totalPages,search,statusFilter,true)} disabled={page===totalPages} style={{padding:"5px 10px",borderRadius:"6px",border:"1px solid #E8D5A3",background:"transparent",color:page===totalPages?"#C4A882":"#6B4F12",cursor:page===totalPages?"not-allowed":"pointer",fontSize:"12px",fontFamily:"inherit"}}>»</button>
              </div>
            )}
          </>
        )}
      </div>
      <style>{`
        @keyframes slideLeft{from{opacity:0;transform:translateX(40px)}to{opacity:1;transform:translateX(0)}}
        @keyframes slideDown{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:translateY(0)}}
        input::placeholder{color:#C4A882;}
        input:focus,select:focus{border-color:#C9A84C !important;}
      `}</style>
    </div>
  );
}
