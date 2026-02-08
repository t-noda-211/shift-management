# エンティティ関連図

このドキュメントは、シフト管理システムのドメインモデルを表現するエンティティ関連図です。DDD（ドメイン駆動設計）に基づいて、エンティティの関連性を定義します。

## ドメインモデル概要

```mermaid
erDiagram
    %% Employee集約
    Employee

    %% ShiftType集約
    ShiftType

    %% ShiftSchedule集約
    ShiftSchedule
    StandardShiftAssignment
    CustomShiftAssignment
    TimeOffAssignment
    ShiftNotice

    ShiftType ||--o{ ShiftSchedule : ""
    ShiftSchedule ||--o{ StandardShiftAssignment: ""
    ShiftSchedule ||--o{ CustomShiftAssignment: ""
    ShiftSchedule ||--o{ TimeOffAssignment: ""
    Employee ||--o{ StandardShiftAssignment: ""
    Employee ||--o{ CustomShiftAssignment: ""
    Employee ||--o{ TimeOffAssignment: ""
    ShiftSchedule ||--o{ ShiftNotice: ""
```

## エンティティ詳細

### Employee

従業員（集約ルート）

従業員情報を表すエンティティ。

### ShiftType

シフト区分（集約ルート）

早番・遅番などシフトの種類を表すエンティティ。

### ShiftSchedule

シフトスケジュール（集約ルート）

シフト全体を表すエンティティ。

#### ルール

- 1ヶ月に1つ存在する

### StandardShiftAssignment

標準シフトアサイン

従業員のシフト区分に応じたシフト状態を表すエンティティ。

### CustomShiftAssignment

カスタムシフトアサイン

従業員のカスタム時間のシフト状態を表すエンティティ。

### TimeOffAssignment

休日アサイン

従業員の休日状態を表すエンティティ。

### ShiftNotice

シフト連絡

従業員への事務連絡を表すエンティティ。
