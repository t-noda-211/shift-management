# エンティティ関連図

このドキュメントは、シフト管理システムのドメインモデルを表現するエンティティ関連図です。DDD（ドメイン駆動設計）に基づいて、エンティティの関連性を定義します。

## ドメインモデル概要

```mermaid
erDiagram
    Employee ||--o{ ShiftSchedule : ""
    ShiftType ||--o{ ShiftSchedule : ""
    ShiftSchedule ||--o{ ShiftAssignment: ""
    Employee ||--o{ ShiftAssignment: ""
    ShiftSchedule ||--o{ TimeOff: ""
    Employee ||--o{ TimeOff: ""
    ShiftSchedule ||--o{ ShiftNotice: ""
```

## エンティティ詳細

### ShiftSchedule

シフトスケジュール

シフト全体を表すエンティティ。

#### ルール

- 1ヶ月に1つ存在する

### Employee

従業員

従業員情報を表すエンティティ。

### ShiftType

シフト区分

早番・遅番などシフトの種類を表すエンティティ。

### ShiftAssignment

シフトアサイン

従業員に対するシフトのアサイン情報を表すエンティティ。

### TimeOff

休日

従業員に対する休日の情報を表すエンティティ。

TimeOffTypeで公休や有給を表現する。

### ShiftNotice

シフト連絡

従業員への事務連絡を表すエンティティ。
