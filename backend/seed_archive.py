from database import SessionLocal
from models.archive import Work, Folder, Document


def seed_archive_data():
    db = SessionLocal()

    try:
        existing_work = db.query(Work).first()

        if existing_work:
            print("Seed data already exists.")
            return

        work = Work(
            title="검은 도시의 기록",
            description="근미래 도시를 배경으로 한 미스터리 장편."
        )

        folder_1 = Folder(
            title="1부",
            sort_order=1
        )

        folder_1.documents = [
            Document(
                title="1화 - 시작",
                content=(
                    "비가 내리는 도시는 늘 같은 냄새를 품고 있었다.\n"
                    "오래된 전선, 젖은 콘크리트, 그리고 아무도 말하지 않는 비밀의 냄새.\n\n"
                    "유하는 새벽 세 시의 정류장에 서 있었다.\n"
                    "마지막 버스는 이미 지나갔고, 전광판에는 존재하지 않는 노선 번호가 깜빡이고 있었다."
                ),
                sort_order=1
            ),
            Document(
                title="2화 - 추적",
                content=(
                    "발신자 없는 메시지는 짧았다.\n\n"
                    "'뒤돌아보지 마.'\n\n"
                    "하지만 사람은 하지 말라는 말을 들었을 때 가장 먼저 그것을 떠올린다."
                ),
                sort_order=2
            )
        ]

        folder_2 = Folder(
            title="설정집",
            sort_order=2
        )

        folder_2.documents = [
            Document(
                title="도시 설정",
                content=(
                    "검은 도시는 네 개의 구역으로 나뉜다.\n\n"
                    "중심구는 행정과 감시의 심장부다.\n"
                    "외곽구는 버려진 산업지대이며, 밤이 되면 지도에서 사라지는 구역이 생긴다."
                ),
                sort_order=1
            )
        ]

        work.folders = [folder_1, folder_2]

        db.add(work)
        db.commit()

        print("Archive seed data inserted.")

    except Exception as error:
        db.rollback()
        print("Seed failed:", error)

    finally:
        db.close()


if __name__ == "__main__":
    seed_archive_data()