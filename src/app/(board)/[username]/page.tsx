import Feed from "@/components/Feed";
import FollowButton from "@/components/FollowButton";
import Image from "@/components/Image";
import { prisma } from "@/prisma";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { notFound } from "next/navigation";

type Params = {
  username: string;
};

const UserPage = async ({ params }: { params: Params }) => {
  const { userId } = await auth();

  const { username } = params;

  const user = await prisma.user.findUnique({
    where: { username },
    include: {
      _count: { select: { followers: true, followings: true } },
      followings: userId ? { where: { followerId: userId } } : undefined,
    },
  });

  if (!user) return notFound();

  return (
    <div>
      {/* Profile Title */}
      <div className="flex items-center gap-8 sticky top-0 backdrop-blur-md p-4 z-10 bg-[#00000084]">
        <Link href="/">
          <Image path="icons/back.svg" alt="back" w={24} h={24} />
        </Link>
        <h1 className="font-bold text-lg">{user.displayName}</h1>
      </div>

      {/* Profile Info */}
      <div>
        {/* Cover & Avatar */}
        <div className="relative w-full">
          <div className="w-full aspect-[3/1] relative">
            <Image
              path={user.cover || "general/cover2.jpg"}
              alt="cover"
              w={600}
              h={200}
              tr
            />
          </div>
          <div className="w-1/5 aspect-square rounded-full overflow-hidden border-4 border-black bg-gray-300 absolute left-4 -translate-y-1/2">
            <Image
              path={user.img || "general/noAvatar.png"}
              alt="avatar"
              w={100}
              h={100}
              tr
            />
          </div>
        </div>

        {/* Top Buttons */}
        <div className="flex w-full items-center justify-end gap-2 p-2">
          {["more", "explore", "message"].map((icon) => (
            <div
              key={icon}
              className="w-9 h-9 flex items-center justify-center rounded-full border-[1px] border-gray-500 cursor-pointer"
            >
              <Image path={`icons/${icon}.svg`} alt={icon} w={20} h={20} />
            </div>
          ))}
          {userId && (
            <FollowButton
              userId={user.id}
              isFollowed={!!user.followings.length}
              username={username}
            />
          )}
        </div>

        {/* User Info */}
        <div className="p-4 flex flex-col gap-2">
          <div>
            <h1 className="text-2xl font-bold">{user.displayName}</h1>
            <span className="text-textGray text-sm">@{user.username}</span>
          </div>
          {user.bio && <p>{user.bio}</p>}

          {/* Location & Joined Date */}
          <div className="flex gap-4 text-textGray text-[15px]">
            {user.location && (
              <div className="flex items-center gap-2">
                <Image path="icons/userLocation.svg" alt="location" w={20} h={20} />
                <span>{user.location}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Image path="icons/date.svg" alt="date" w={20} h={20} />
              <span>
                Joined{" "}
                {new Date(user.createdAt).toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>

          {/* Follower Stats */}
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <span className="font-bold">{user._count.followers}</span>
              <span className="text-textGray text-[15px]">Followers</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold">{user._count.followings}</span>
              <span className="text-textGray text-[15px]">Followings</span>
            </div>
          </div>
        </div>
      </div>

      {/* Feed */}
      <Feed userProfileId={user.id} />
    </div>
  );
};

export default UserPage;
