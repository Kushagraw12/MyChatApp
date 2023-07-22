import { createClient } from "@supabase/supabase-js";
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  {
    realtime: {
      params: {
        eventsPerSecond: 10,
      },
    },
  }
);

const channel = supabase.channel("realtime_messages");

supabase
  .channel("realtime_messages", {
    config: {
      broadcast: {
        self: true,
      },
    },
  })
  .on("broadcast", { event: "supa" }, (payload) => console.log(payload))
  .subscribe((status) => {
    if (status === "SUBSCRIBED") {
      channel.send({
        type: "broadcast",
        event: "supa",
        payload: { data: "data is there" },
      });
    }
  });
