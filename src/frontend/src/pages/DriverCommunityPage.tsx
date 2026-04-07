import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { AlertTriangle, MessageSquare, ThumbsUp, Users } from "lucide-react";
import { useState } from "react";

const alerts = [
  {
    id: 1,
    driver: "Ranjeet Singh",
    location: "NH-44, near Panipat",
    message: "Accident at KM 92. 2 trucks involved. Slow down, police on site.",
    time: "15 min ago",
    upvotes: 42,
    type: "Accident",
  },
  {
    id: 2,
    driver: "Manoj Yadav",
    location: "NH-48, Manesar",
    message: "Heavy traffic jam – 8 km long. Avoid if possible.",
    time: "1 hr ago",
    upvotes: 67,
    type: "Traffic",
  },
  {
    id: 3,
    driver: "Balvinder Kaur",
    location: "Delhi-Agra Expressway",
    message: "Police naka checking at KM 124. All papers ready rakhein.",
    time: "2 hrs ago",
    upvotes: 89,
    type: "Police",
  },
  {
    id: 4,
    driver: "Suresh Nair",
    location: "NH-66, near Pune",
    message: "Road under repair, only one lane open for 5 km.",
    time: "3 hrs ago",
    upvotes: 35,
    type: "Road Work",
  },
];

const discussions = [
  {
    id: 1,
    name: "Harbhajan Singh",
    avatar: "H",
    message:
      "Koi bata sakta hai NH-44 pe sabse achha dhaba kahan hai? Ludhiana ke paas?",
    time: "5 min ago",
    likes: 12,
    comments: 8,
  },
  {
    id: 2,
    name: "Pradeep Kumar",
    avatar: "P",
    message:
      "FASTag recharge kahan se karna chahiye online? Koi safe app batao.",
    time: "20 min ago",
    likes: 6,
    comments: 15,
  },
  {
    id: 3,
    name: "Ganesh Rathod",
    avatar: "G",
    message:
      "Tata 407 ka clutch plate change karne ka kya rate chal raha hai aajkal Nagpur mein?",
    time: "1 hr ago",
    likes: 9,
    comments: 22,
  },
  {
    id: 4,
    name: "Abdul Rahman",
    avatar: "A",
    message:
      "Return load chahiye Delhi se Jaipur. Koi hai kya? 24 tonne available.",
    time: "2 hrs ago",
    likes: 18,
    comments: 5,
  },
  {
    id: 5,
    name: "Deepak Verma",
    avatar: "D",
    message:
      "Monsoon mein Nashik ghat road kaisi condition hai? Koi update dega?",
    time: "4 hrs ago",
    likes: 31,
    comments: 14,
  },
];

const groups = [
  {
    id: 1,
    name: "Delhi-Mumbai Highway Drivers",
    members: 4820,
    description: "NH-44 & NH-48 pe drivers ka community",
    region: "Pan India",
  },
  {
    id: 2,
    name: "Punjab Truck Owners Association",
    members: 3100,
    description: "Punjab ke truck owners ki ekta",
    region: "Punjab",
  },
  {
    id: 3,
    name: "Maharashtra Logistics Network",
    members: 2650,
    description: "Maharashtra ke transporters",
    region: "Maharashtra",
  },
  {
    id: 4,
    name: "Tamil Nadu Goods Vehicle Union",
    members: 1980,
    description: "TN truck drivers support group",
    region: "Tamil Nadu",
  },
  {
    id: 5,
    name: "UP-Bihar Truck Drivers",
    members: 5540,
    description: "Uttar Pradesh & Bihar ke drivers",
    region: "UP / Bihar",
  },
  {
    id: 6,
    name: "Rajasthan Transporters Hub",
    members: 1750,
    description: "Desert route ke experts",
    region: "Rajasthan",
  },
];

const alertTypeColor: Record<string, string> = {
  Accident: "bg-red-100 text-red-700 border-red-200",
  Traffic: "bg-orange-100 text-orange-700 border-orange-200",
  Police: "bg-blue-100 text-blue-700 border-blue-200",
  "Road Work": "bg-yellow-100 text-yellow-700 border-yellow-200",
};

export default function DriverCommunityPage() {
  const [newPost, setNewPost] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <div className="p-4 max-w-2xl mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Driver Community
          </h1>
          <p className="text-muted-foreground text-sm">
            Connect, share alerts, join groups
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" data-ocid="community.open_modal_button">
              <MessageSquare className="w-4 h-4 mr-1" />
              Post
            </Button>
          </DialogTrigger>
          <DialogContent data-ocid="community.dialog">
            <DialogHeader>
              <DialogTitle>Share with Community</DialogTitle>
            </DialogHeader>
            <Textarea
              placeholder="Highway alert, question, ya koi baat share karo..."
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              rows={4}
              data-ocid="community.post_textarea"
            />
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setDialogOpen(false)}
                data-ocid="community.cancel_button"
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  setNewPost("");
                  setDialogOpen(false);
                }}
                data-ocid="community.submit_button"
              >
                Post
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="alerts">
        <TabsList className="w-full">
          <TabsTrigger
            value="alerts"
            className="flex-1"
            data-ocid="community.alerts_tab"
          >
            <AlertTriangle className="w-4 h-4 mr-1" />
            Alerts
          </TabsTrigger>
          <TabsTrigger
            value="discussions"
            className="flex-1"
            data-ocid="community.discussions_tab"
          >
            <MessageSquare className="w-4 h-4 mr-1" />
            Discuss
          </TabsTrigger>
          <TabsTrigger
            value="groups"
            className="flex-1"
            data-ocid="community.groups_tab"
          >
            <Users className="w-4 h-4 mr-1" />
            Groups
          </TabsTrigger>
        </TabsList>

        <TabsContent value="alerts" className="space-y-3 mt-4">
          {alerts.map((a, i) => (
            <Card key={a.id} data-ocid={`community.alert.item.${i + 1}`}>
              <CardContent className="p-4 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                        {a.driver[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-semibold">{a.driver}</p>
                      <p className="text-xs text-muted-foreground">{a.time}</p>
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className={`text-xs ${alertTypeColor[a.type]}`}
                  >
                    {a.type}
                  </Badge>
                </div>
                <p className="text-sm">{a.message}</p>
                <p className="text-xs text-muted-foreground">📍 {a.location}</p>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 gap-1 text-xs px-2"
                >
                  <ThumbsUp className="w-3 h-3" />
                  {a.upvotes} Helpful
                </Button>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="discussions" className="space-y-3 mt-4">
          {discussions.map((d, i) => (
            <Card key={d.id} data-ocid={`community.discussion.item.${i + 1}`}>
              <CardContent className="p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="text-xs bg-secondary text-secondary-foreground">
                      {d.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-semibold">{d.name}</p>
                    <p className="text-xs text-muted-foreground">{d.time}</p>
                  </div>
                </div>
                <p className="text-sm">{d.message}</p>
                <div className="flex gap-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 gap-1 text-xs px-2"
                  >
                    <ThumbsUp className="w-3 h-3" />
                    {d.likes}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 gap-1 text-xs px-2"
                  >
                    <MessageSquare className="w-3 h-3" />
                    {d.comments}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="groups" className="space-y-3 mt-4">
          {groups.map((g, i) => (
            <Card key={g.id} data-ocid={`community.group.item.${i + 1}`}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm">{g.name}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {g.description}
                    </p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {g.members.toLocaleString()} members
                      </span>
                      <Badge variant="secondary" className="text-xs">
                        {g.region}
                      </Badge>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    data-ocid={`community.join.button.${i + 1}`}
                  >
                    Join
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
